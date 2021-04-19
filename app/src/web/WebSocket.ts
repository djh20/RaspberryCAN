import WebSocket, { Server } from 'ws';
import { Server as HttpServer } from 'http';
import Logger from '../util/Logger';
import Metric from '../vehicle/Metric';
import App from '../app/App';

export default class WebSocketServer {
  public server: Server;
  private app: App;
  private subscriptions: Subscription[] = [];

  constructor(app: App) {
    this.app = app;
  }

  start(server: HttpServer) {
    this.server = new Server({server: server});

    this.server.on('connection', (socket) => {
      let metrics = Array.from(this.app.vehicle.metrics.values());

      socket.on('message', (data) => {
        Logger.info('WS', `Incoming: ${data}`);
        if (data == "subscribe_binary") {
          let subscription = new Subscription(socket, Topic.Binary);
          this.subscriptions.push(subscription);

          this.sendMetrics(metrics, [subscription]);
        } else if (data[0] == 1) {
          this.app.vehicle.gps.reset();
        }
      });

      socket.on('close', () => {
        // filter the subscriptions array and only keep subs that belong to other sockets
        this.subscriptions = this.subscriptions.filter(sub => sub.socket != socket);
      });
    });

    this.app.vehicle.on('metricUpdated', (metric: Metric) => {
      this.sendMetrics([metric], this.subscriptions);
    });

    Logger.info('WS', `Ready!`);
  }

  sendMetrics(metrics: Metric[], subscriptions: Subscription[]) {
    metrics.forEach((metric) => {
      if (metric.point.id == undefined) return;
      let binarySubs = this.subscriptions.filter(sub => sub.topic == Topic.Binary);
      if (binarySubs) {
        let data = metric.asByteArray();
        binarySubs.forEach(sub => sub.send(data));
      }
    });
  }

  /*
  broadcast(data: any, topic: Topic) {
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
  */
}

class Subscription {
  public socket: WebSocket;
  public topic: Topic;

  constructor(socket: WebSocket, topic: Topic) {
    this.socket = socket;
    this.topic = topic;
  }

  send(data: any) {
    if (this.socket.readyState != WebSocket.OPEN) return;
    this.socket.send(data);
  }
}

enum Topic {
  Binary
}