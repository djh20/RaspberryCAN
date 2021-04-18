import WebSocket, { Server } from 'ws';
import Metric from '../vehicle/Metric';
import App from './App';

export default class WebSocketServer {
  public server: Server;
  private app: App;

  constructor(app: App) {
    this.app = app;
  }

  start(port: number) {
    this.server = new Server({port: port});

    this.server.on('connection', (socket) => {
      let metrics = Array.from(this.app.vehicle.metrics.values());
      
      this.sendMetrics(metrics, socket);

      socket.on('message', (data: Buffer) => {
        let command = data[0];
        if (command == 1) this.app.vehicle.gps.reset();
      });
    });

    this.app.vehicle.on('metricUpdated', (metric: Metric) => {
      this.sendMetrics([metric]);
    });

    console.log("SUCCESS Initalize websocket");
  }

  broadcast(data: any) {
    this.server.clients.forEach((client) => {
      if (client.readyState != WebSocket.OPEN) return;
      client.send(data);
    });
  }

  sendMetrics(metrics: Metric[], socket?: WebSocket) {
    metrics.forEach((metric) => {
      if (metric.point.id == undefined) return; // if a metric doesn't have an id, it shouldn't be sent.
      let data = metric.asByteArray();
      socket ? socket.send(data) : this.broadcast(data);
    });
  }
}