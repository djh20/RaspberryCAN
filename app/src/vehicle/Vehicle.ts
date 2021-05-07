import { EventEmitter } from "events";
import CanModule, { CanPoint } from "./Can";
import GpsModule from "./Gps";
import Metric from "./Metric";
import TripManager from "./TripManager";

export default class Vehicle extends EventEmitter {
  public definition?: VehicleDefinition;
  public metrics: Map<string, Metric>;
  public can: CanModule;
  public gps?: GpsModule;
  public tripManager: TripManager;

  constructor(definition?: VehicleDefinition) {
    super();
    this.definition = definition;
    this.metrics = new Map<string, Metric>();
    this.can = new CanModule(this);
    this.tripManager = new TripManager();
  }

  public setDefinition(definition: VehicleDefinition) {
    if (definition.can) {
      this.metrics.clear();
      // create all the metrics in the definition
      definition.can.forEach(group => {
        group.points.forEach(point => this.getMetric(point));
      });
    }

    this.definition = definition;
  }

  public getMetric(point: CanPoint): Metric {
    let metric = this.metrics.get(point.name);
    if (!metric) {
      metric = new Metric(this, point);
      this.metrics.set(point.name, metric);
    }
    return metric;
  }
}

export type VehicleDefinition = {
  id: string,
  name?: string,
  getInfo?: (metrics: Map<string, Metric>) => VehicleInfo,
  can?: {
    id: number,
    name?: string,
    points?: CanPoint[]
  }[]
}
type VehicleInfo = {
  moving: boolean;
}