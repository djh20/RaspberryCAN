const WebSocket = require('ws');

class WebSocketServer {
  constructor() {}

  listen(port) {
    let server = new WebSocket.Server({
      port: port
    });

    server.on('connection', (socket) => {
      console.log(socket);

    });

    this.server = server;
  }
}

module.exports = {WebSocketServer}