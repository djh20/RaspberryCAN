"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const Can_1 = __importDefault(require("./Can"));
const Gps_1 = __importDefault(require("./Gps"));
const Metric_1 = __importDefault(require("./Metric"));
class Vehicle extends events_1.EventEmitter {
    constructor() {
        super();
        this.metrics = new Map();
        this.can = new Can_1.default(this);
        this.gps = new Gps_1.default(this);
    }
    getMetric(point) {
        let metric = this.metrics.get(point.name);
        if (!metric) {
            metric = new Metric_1.default(this, point);
            this.metrics.set(point.name, metric);
        }
        return metric;
    }
}
exports.default = Vehicle;
