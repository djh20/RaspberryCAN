/*
  Websocket plugin

  Creates a websocket and sends CAN data through it.
*/

const WebSocket = require('ws');

class WebsocketPlugin {
  constructor() {}

  async register(plugin) {
    // get port from app config
    let port = plugin.manager.app.config.data.port;
    
    // create the websocket server
    this.server = new WebSocket.Server({
      port: port
    });

    this.plugin = plugin;
    this.port = port;
    return true;
  }

  start() {
    // find the CAN plugin
    let can_plugin = this.plugin.manager.plugins.get('can');

    // listen for websocket connections
    this.server.on('connection', (socket) => {
      // if the CAN plugin is loaded, send all metrics through the websocket.
      if (can_plugin) {
        let metrics = Object.values(can_plugin.data.metrics);
        this.sendMetrics(metrics, socket);
      }
    });

    if (can_plugin) {
      // listen for the metricUpdated event (from CAN plugin)
      can_plugin.on('metricUpdated', (metric) => {
        this.sendMetrics([metric]);
        
        /*
        let data = new Uint16Array([5000/100]);
        if (data.byteLength >= 2) {
          data = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        }
        let merged = new Uint8Array(data.length + 1);
        merged.set(new Uint8Array([255]));
        merged.set(data, 1);

        this.broadcast(merged);
        */
      });
    }

    this.plugin.logger.info(`Listening at ws://localhost:${this.port}`);
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

module.exports = new WebsocketPlugin();