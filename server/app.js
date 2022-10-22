var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function onHttpRequest(req, resp) {
  // serve client data
});
server.listen(8000, function() { });

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

function onWsJson(conn, obj) {
  switch (obj.type) {
    case "get_position": {
      const coords = seatDb[obj.seat] || [NaN, NaN];
      conn.send(JSON.stringify({
        type: "set_position",
        x: coords[0],
        y: coords[1]
      }));
      console.info(obj);
      break;
    }
  }
  console.log("json object", obj);
}

// WebSocket server
wsServer.on('request', function onWsRequest(req) { // on ws connection
  var conn = req.accept(null, req.origin);
  console.info("opening client");

  conn.on('message', function onWsMessage(msg) {
    if (msg.type === 'utf8') { // if it's utf, try to parse it as json
      try {
        data = JSON.parse(msg.utf8Data);
        onWsJson(conn, data);
      } catch (err) {
        if (err instanceof SyntaxError) console.warn("ignoring invalid message", msg);
        else throw err;
      }
    }
  });

  conn.on('close', function onWsClose(conn) {
    console.info("closing client.");
  });
});
