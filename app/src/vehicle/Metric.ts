import { CanPoint } from "./Can";
import Vehicle, { VehicleDefinition } from "./Vehicle";

export default class Metric {
  public value: number;
  public point?: CanPoint;

  private lastUpdate: number;
  private vehicle: Vehicle;

  constructor(vehicle: Vehicle, point?: CanPoint) {
    this.vehicle = vehicle;
    this.point = point;
    this.value = 0;
  }

  public setValue(val: number) {
    if (val == null) return;

    if (this.point.interval) {
      let timeSinceLastUpdate = Date.now() - this.lastUpdate;
      if (timeSinceLastUpdate < this.point.interval) return;
    }

    val = Math.round((val + Number.EPSILON) * 100) / 100;
    if (val == this.value) return;
    
    this.lastUpdate = Date.now();
    this.value = val;

    this.vehicle.emit('metricUpdated', this);
  }

  public asByteArray(): Uint8Array {
    let data = this.point?.convert ? this.point.convert(this.value) : new Uint8Array([this.value]);
    
    if (data.byteLength >= 2) {
      data = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    }

    let merged = new Uint8Array(data.length + 1);
    
    merged.set(new Uint8Array([this.point.id]));
    merged.set(data, 1);
    
    return merged;
  }
}