const EventEmitter = require('events').EventEmitter;
const WebSocket = require('ws');

class WebSocketServer extends EventEmitter {
  listen(port) {
    let server = new WebSocket.Server({
      port: port
    });

    server.on('connection', (socket) => {
      this.emit('connection', socket);
      /*socket.on('message', (message) => {
        console.log(`[websocket] > ${message}`);
      });*/
    });
    
    this.server = server;
  }

  broadcast(message) {
    this.server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  sendMetrics(metrics, socket) {
    metrics.forEach((metric) => {
      if (metric.id == undefined) return; // if a metric doesn't have an id, it shouldn't be sent.
      let data = metric.asByteArray();
      socket ? socket.send(data) : this.broadcast(data);
    });
  }
}

module.exports = {WebSocketServer}