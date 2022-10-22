var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function onHttpRequest(req, resp) {
  // serve client data
});
server.listen(8000, function() { console.log("http server started"); });

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

const seatDb = {
  "102": [ 0.1, 0.5 ],
  "103": [ 0.2, 0.5 ],
  "104": [ 0.3, 0.5 ],
  "105": [ 0.4, 0.5 ],
}

const clientDb = {
  conns: new Set(),
  ids: new Uint8Array(65536),
  
  allocId() {
    id = ids.indexOf(0);
    if (id !== -1) {
      ids[id] = 1;
    } else {
      console.warn("client limit reached!");
    }
    return id;
  },
  
  freeId(id) {
    ids[id] = 0;
  },
  
  add(conn) {
    this.conns.add(conn);
    conn.id = this.allocId();
  },
  
  delete(conn) {
    this.conns.delete(conn);
    this.freeId(conn.id);
  },
};

const password = "this is an awful password!"

function onWsJson(conn, obj) {
  switch (obj.type) {
    case "get_position": {
      const coords = seatDb[obj.seat] || [NaN, NaN];
      conn.sendJson({
        type: "set_position",
        
        x: coords[0],
        y: coords[1],
        
        id: conn.id,
      });
      console.info(obj);
      break;
    }
    case "promote": {
      if (obj.password === password) { // if the client has the magic password,
        console.info("new admin added");
        conn.admin = true;
      }
    }
    case "set_command": {
      if (conn.admin) { // make sure the user is admin
        clientDb.conns.forEach((client) => { 
          if (!client.admin) client.sendJson({ // send command to all clients
            type: "set_command",
            command: conn.command
          });
        });
      }
    }
  }
  console.debug("json object", obj);
}

const ids = new Uint8Array(65536); // 1 if id is in use


// WebSocket server
wsServer.on('request', function onWsRequest(req) { // on ws connection
  var conn = req.accept(null, req.origin);
  
  clientDb.add(conn);
  conn.sendJson = (json) => conn.send(JSON.stringify(json));
  
  console.debug("new client, id", conn.id);

  conn.on('message', function onWsMessage(msg) {
    if (msg.type === 'utf8') { // if it's utf, try to parse it as json
      try {
        data = JSON.parse(msg.utf8Data);
        onWsJson(conn, data);
      } catch (err) {
        if (err instanceof SyntaxError) console.warn("ignoring invalid client message", msg);
        else throw err;
      }
    }
  });

  conn.on('close', function onWsClose(_conn) {
    console.debug("close client, id", conn.id);
    clientDb.delete(conn);
  });
});
