import GPS from 'gps';
import SerialPort, { parsers } from 'serialport'; 
import Logger from '../util/Logger';
import Metric from './Metric';
import Vehicle from './Vehicle';

export default class GpsModule {
  public connected: boolean;
  public locked: boolean;
  public lat: number;
  public lon: number;
  public travelled: number;

  private tripMetric: Metric;
  private statusMetric: Metric;

  private vehicle: Vehicle;
  private gps: GPS;
  private socket: SerialPort;

  constructor(vehicle: Vehicle) {
    this.vehicle = vehicle;
    this.gps = new GPS();
    this.travelled = 0;
    this.connected = false;
  }

  public listen() {
    if (!this.socket) return;
    let parser = this.socket.pipe(new parsers.Readline({ delimiter: '\r\n' }));

    parser.on('data', data => this.gps.update(data));

    setInterval(() => this.update(), 3000);
    this.update();
  }

  public connect(port: string): Promise<boolean> {
    return new Promise((resolve) => {
      let socket = new SerialPort(port, {baudRate: 9600}, (err) => {
        if (!err) {
          Logger.info('GPS', "Connected!");
          this.connected = true;
          resolve(true);
        } else {
          Logger.warn('GPS', "Failed to connect!");
          this.connected = false;
          resolve(false);
        }
      });

      this.socket = socket;
    });
  }

  public update() {
    let lat = this.gps.state.lat;
    let lon = this.gps.state.lon;

    this.locked = lat != null && lon != null;

    this.statusMetric = this.vehicle.getMetric({
      name:'gps_status', 
      id:254
    });

    this.tripMetric = this.vehicle.getMetric({
      name:'gps_trip_distance', 
      id:255,
      convert: (value) => new Uint16Array([value/100])
    });

    this.statusMetric.setValue(this.locked ? 1 : 0);

    if (!this.locked) return;
    if (lat == this.lat && lon == this.lon) return;

    let info = this.vehicle.definition.getInfo(this.vehicle.metrics);

    if (this.lat != null && this.lon != null && info.moving) {
      let distance = GPS.Distance(
        this.lat, 
        this.lon,
        lat,
        lon
      ) * 1000; // convert from km to m
      
      distance = Math.round((distance + Number.EPSILON) * 100) / 100;

      // to try and correct for gps wandering and glitching.
      // this isn't a very good way of doing it, it should probably be changed.
      if (distance <= 0.3 || distance >= 1000) return;
      this.travelled += distance;

      Logger.info('GPS', `Moved ${distance}m (total: ${this.travelled}m)`);

      this.tripMetric.setValue(this.travelled);
    }

    this.lat = lat;
    this.lon = lon;
  }

  public reset() {
    this.travelled = 0;

    if (!this.tripMetric) return;
    this.tripMetric.setValue(0);
  }
}