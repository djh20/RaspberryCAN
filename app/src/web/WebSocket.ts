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
          let subscription = new BinarySubscription(socket);
          this.subscriptions.push(subscription);
          subscription.sendMetrics(metrics);
        } else if (data == "subscribe_json") {
          let subscription = new JsonSubscription(socket);
          this.subscriptions.push(subscription);
          subscription.sendMetrics(metrics);
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
      this.subscriptions.forEach(sub => sub.sendMetrics([metric]));
    });

    Logger.info('WS', `Ready!`);
  }
}

abstract class Subscription {
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

  abstract sendMetrics(metrics: Metric[]);
}

class BinarySubscription extends Subscription {
  constructor(socket: WebSocket) { 
    super(socket, Topic.Binary);
  }
  
  sendMetrics(metrics: Metric[]) {
    metrics.forEach((metric) => {
      if (metric.point.id == undefined) return;
      let data = metric.asByteArray();
      this.send(data);
    });
  }
}

class JsonSubscription extends Subscription {
  constructor(socket: WebSocket) { 
    super(socket, Topic.Text);
  }
  
  sendMetrics(metrics: Metric[]) {
    let data: JsonData = {};
    data.metrics = metrics.map(m => {
      return {name: m.point.name, value: m.value, suffix: m.point.suffix};
    });
    this.send(JSON.stringify(data));
  }
}
type JsonData = {
  metrics?: {
    name: string;
    value: number;
    suffix?: string;
  }[]
}

enum Topic {
  Binary,
  Text
}