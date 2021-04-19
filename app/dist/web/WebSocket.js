"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importStar(require("ws"));
const Logger_1 = __importDefault(require("../util/Logger"));
class WebSocketServer {
    constructor(app) {
        this.subscriptions = [];
        this.app = app;
    }
    start(server) {
        this.server = new ws_1.Server({ server: server });
        this.server.on('connection', (socket) => {
            let metrics = Array.from(this.app.vehicle.metrics.values());
            socket.on('message', (data) => {
                Logger_1.default.info('WS', `Incoming: ${data}`);
                if (data == "subscribe_binary") {
                    let subscription = new Subscription(socket, Topic.Binary);
                    this.subscriptions.push(subscription);
                    this.sendMetrics(metrics, [subscription]);
                }
                else if (data[0] == 1) {
                    this.app.vehicle.gps.reset();
                }
            });
            socket.on('close', () => {
                // filter the subscriptions array and only keep subs that belong to other sockets
                this.subscriptions = this.subscriptions.filter(sub => sub.socket != socket);
            });
        });
        this.app.vehicle.on('metricUpdated', (metric) => {
            this.sendMetrics([metric], this.subscriptions);
        });
        Logger_1.default.info('WS', `Ready!`);
    }
    sendMetrics(metrics, subscriptions) {
        metrics.forEach((metric) => {
            if (metric.point.id == undefined)
                return;
            let binarySubs = this.subscriptions.filter(sub => sub.topic == Topic.Binary);
            if (binarySubs) {
                let data = metric.asByteArray();
                if (metric.point.log != false)
                    console.log(metric.point.name, metric.value, data);
                binarySubs.forEach(sub => sub.send(data));
            }
        });
    }
}
exports.default = WebSocketServer;
class Subscription {
    constructor(socket, topic) {
        this.socket = socket;
        this.topic = topic;
    }
    send(data) {
        if (this.socket.readyState != ws_1.default.OPEN)
            return;
        this.socket.send(data);
    }
}
var Topic;
(function (Topic) {
    Topic[Topic["Binary"] = 0] = "Binary";
})(Topic || (Topic = {}));
