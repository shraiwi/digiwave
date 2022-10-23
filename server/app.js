var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
var nodeStatic = require('node-static');

const serverRoot = "client/"
const password = "this is an awful password!";
const seatDb = JSON.parse(fs.readFileSync("seatdb.json"));

var fileServer = new nodeStatic.Server(serverRoot);

var server = http.createServer(function onHttpRequest(req, resp) {
  req.addListener("end", function () {
    fileServer.serve(req, resp);
  }).resume();
});
server.listen(8000, function() { console.log("http server started"); });

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

const clientDb = {
  conns: new Set(),
  ids: new Uint8Array(65536),
  
  allocId() {
    id = this.ids.indexOf(0);
    if (id !== -1) {
      this.ids[id] = 1;
    } else {
      console.warn("client limit reached!");
    }
    return id;
  },
  
  freeId(id) {
    this.ids[id] = 0;
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
      break;
    }
    case "set_command": {
      if (conn.admin) { // make sure the user is admin
        const clientCommand = { // send command to all clients
          type: "set_command",
          command: obj.command
        };
        const serializedData = JSON.stringify(clientCommand);
        clientDb.conns.forEach((client) => { 
          if (!client.admin) client.send(serializedData);
        });
      }
      break;
    }
  }
  console.debug("json object", obj);
}

// ws server
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
