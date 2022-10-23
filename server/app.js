var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
var nodeStatic = require('node-static');

const serverRoot = "client/"
const password = "this is an awful password!";
const seatDb = JSON.parse(fs.readFileSync("seatdb.json"));

var fileServer = new nodeStatic.Server(serverRoot);

// create http server
var server = http.createServer(function onHttpRequest(req, resp) {
  req.addListener("end", function () {
    fileServer.serve(req, resp);
  }).resume();
});
server.listen(8000, function() { console.log("http server started"); });

// create websockets server
wsServer = new WebSocketServer({
  httpServer: server
});

// a database keeping track of clients, assigning unique 16-bit ids for each.
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
  
  // allocate an id and add the client
  add(conn) {
    this.conns.add(conn);
    conn.id = this.allocId();
  },
  
  // free an id and delete the client
  delete(conn) {
    this.conns.delete(conn);
    this.freeId(conn.id);
  },
};

// called when a json object from a client is successfully parsed.
function onWsJson(conn, obj) {
  switch (obj.type) {
    case "get_position": { // client is requesting their position, parse their seat number.
      const coords = seatDb[obj.seat] || [NaN, NaN]; // return nan, nan if the seat is not found.
      conn.sendJson({
        type: "set_position",
        
        x: coords[0],
        y: coords[1],
        
        id: conn.id,
      });
      break;
    }
    case "promote": { // client is requesting to become an admin, verify the password.
      if (obj.password === password) { // if the client has the magic password (this is totally secure)
        console.info("new admin added");
        conn.admin = true;
      }
      break;
    }
    case "set_command": { // admin is requesting to relay a command to all clients
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
  console.verbose("json object", obj);
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
