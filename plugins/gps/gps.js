/*
  GPS plugin

  Uses a serial gps to track trip distance.
*/

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const gps = require('gps');

class GpsPlugin {
  constructor() {
    this.device = new gps();
  }

  async register(plugin) {
    plugin.data.active = true;
    plugin.data.distance = 0;
    plugin.data.latitude = null;
    plugin.data.longitude = null;

    let port = plugin.config.port;

    if (!port) {
      plugin.logger.error('No port defined in plugin configuration.');
      return false;
    }

    this.websocket_plugin = plugin.manager.plugins.get('websocket');
    this.plugin = plugin;
    this.port = port;

    return true;
  }

  start() {
    this.connect()
      .then((value) => {
        if (!value) return;
        this.plugin.logger.info("Connected!");
        this.listen();
      })
      .catch(err => this.plugin.logger.error(err));
  }

  update() {
    // TODO: check car on and not in park
    let lat = this.device.state.lat;
    let lon = this.device.state.lon;
    let last_lat = this.plugin.data.latitude;
    let last_lon = this.plugin.data.longitude;

    if (lat == null || lon == null) return;
    if (lat == last_lat && lon == last_lon) return;

    if (last_lat != null && last_lon != null && this.plugin.data.active) {
      let distance = gps.Distance(
        this.plugin.data.latitude, 
        this.plugin.data.longitude,
        lat,
        lon
      ) * 1000; // convert from km to m
      
      distance = Math.round((distance + Number.EPSILON) * 100) / 100;

      // to try and correct for gps wandering and glitching.
      // this isn't a very good way of doing it, it should probably be changed.
      if (distance <= 0.3 || distance >= 1000) return;

      this.plugin.data.distance += distance;
      this.plugin.logger.info(`Location updated (moved ${distance} m).`);

      if (this.websocket_plugin) {
        let data = new Uint16Array([this.plugin.data.distance/100]);
        if (data.byteLength >= 2) {
          data = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        }
        let merged = new Uint8Array(data.length + 1);
        merged.set(new Uint8Array([255]));
        merged.set(data, 1);

        this.websocket_plugin.instance.broadcast(merged);
      }
    }

    this.plugin.data.latitude = lat;
    this.plugin.data.longitude = lon;
  }

  listen() {
    let can_plugin = this.plugin.manager.plugins.get('can');
    let parser = this.socket.pipe(new Readline({ delimiter: '\r\n' }));

    parser.on('data', (data) => {
      this.device.update(data);
    });

    setInterval(() => this.update(), 3000);
  }

  connect() {
    return new Promise((resolve, reject) => {
      let socket = new SerialPort(this.port, {baudRate: 9600}, (err) => {
        if (err) reject(err);
        resolve(true);
      });

      this.socket = socket;
    });
  }
}

module.exports = new GpsPlugin();