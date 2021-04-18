import { EventEmitter } from "events";
import CanModule, { CanDefinitionPoint } from "./Can";
import GpsModule from "./Gps";
import Metric from "./Metric";

export default class Vehicle extends EventEmitter {
  public metrics: Map<string, Metric>;
  public can: CanModule;
  public gps: GpsModule;

  constructor() {
    super();
    this.metrics = new Map<string, Metric>();
    this.can = new CanModule(this);
    this.gps = new GpsModule(this);
  }

  public getMetric(point: CanDefinitionPoint): Metric {
    let metric = this.metrics.get(point.name);
    if (!metric) {
      metric = new Metric(this, point);
      this.metrics.set(point.name, metric);
    }
    return metric;
  }
}
