"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const Can_1 = __importDefault(require("./Can"));
const Metric_1 = __importDefault(require("./Metric"));
const TripManager_1 = __importDefault(require("./TripManager"));
class Vehicle extends events_1.EventEmitter {
    constructor(definition) {
        super();
        this.definition = definition;
        this.metrics = new Map();
        this.can = new Can_1.default(this);
        this.tripManager = new TripManager_1.default(this);
    }
    setDefinition(definition) {
        if (definition.can) {
            this.metrics.clear();
            // create all the metrics in the definition
            definition.can.forEach(group => {
                group.points.forEach(point => this.getMetric(point));
            });
        }
        this.definition = definition;
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
