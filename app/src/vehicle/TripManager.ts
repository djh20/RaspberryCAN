import * as p from 'path';
import FileSystem from "../util/FileSystem";
import { Trip, TripInfo } from "./Trip";
import Vehicle from "./Vehicle";

export default class TripManager {
  public trips: Trip[];
  public currentTrip: Trip;

  private vehicle: Vehicle;
  private folderPath: string;

  constructor(vehicle: Vehicle) {
    this.vehicle = vehicle;
    this.trips = []; 
  }

  public async load(folderPath: string) {
    let directory = await FileSystem.readDirectory({path: folderPath});
   
    for (let child of directory.children) {
      let trip = await this.loadTrip(child.path);

      if (trip.info.timeEnd == null) this.currentTrip = trip;
    }

    this.folderPath = folderPath;
  }

  public async addWaypoint(lat: number, lon: number) {
    // TODO: manage files

    if (!this.currentTrip) {
      let path = p.resolve(this.folderPath, `trip_${Date.now()}.json`);
      this.currentTrip = await this.loadTrip(path);
    }

    let metrics = {};
    
    for (let metric of this.vehicle.metrics.values()) {
      // if the metric is loggable, add it to the metrics object.
      if (metric.point.log) metrics[metric.point.name] = metric.value;
    }

    this.currentTrip.info.waypoints.push({lat:lat, lon:lon, metrics:metrics});
    this.currentTrip.save();
  }

  public endTrip() {
    if (!this.currentTrip) return;

    this.currentTrip.info.timeEnd = Date.now();
    this.currentTrip.save();
    this.currentTrip = null;
  }

  private async loadTrip(path: string): Promise<Trip> {
    let data = await FileSystem.readFile({path:path, json:true});
    let json: TripInfo = data.json || {timeStart: Date.now(), timeEnd: null, waypoints: []};

    let trip = new Trip(path, json);
    this.trips.push(trip);
    return trip;
  }
}