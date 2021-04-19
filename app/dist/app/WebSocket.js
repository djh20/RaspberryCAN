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
        this.app = app;
    }
    start(server) {
        this.server = new ws_1.Server({ server: server });
        this.server.on('connection', (socket) => {
            let metrics = Array.from(this.app.vehicle.metrics.values());
            this.sendMetrics(metrics, socket);
            socket.on('message', (data) => {
                let command = data[0];
                if (command == 1)
                    this.app.vehicle.gps.reset();
            });
        });
        this.app.vehicle.on('metricUpdated', (metric) => {
            this.sendMetrics([metric]);
        });
        Logger_1.default.info('WS', `Ready!`);
    }
    broadcast(data) {
        this.server.clients.forEach((client) => {
            if (client.readyState != ws_1.default.OPEN)
                return;
            client.send(data);
        });
    }
    sendMetrics(metrics, socket) {
        metrics.forEach((metric) => {
            if (metric.point.id == undefined)
                return; // if a metric doesn't have an id, it shouldn't be sent.
            let data = metric.asByteArray();
            socket ? socket.send(data) : this.broadcast(data);
        });
    }
}
exports.default = WebSocketServer;
