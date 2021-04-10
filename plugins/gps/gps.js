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
    plugin.data.distance = 0;
    plugin.data.latitude = null;
    plugin.data.longitude = null;

    let port = plugin.config.port;

    if (!port) {
      plugin.logger.error('No port defined in plugin configuration.');
      return false;
    }

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

  listen() {
    let can_plugin = this.plugin.manager.plugins.get('can');
    let parser = this.socket.pipe(new Readline({ delimiter: '\r\n' }));

    parser.on('data', (data) => {
      this.device.update(data);
    });

    this.device.on('data', () => {
      // TODO: check car on and not in park
      let lat = this.device.state.lat;
      let lon = this.device.state.lon;
      let last_lat = this.plugin.data.latitude;
      let last_lon = this.plugin.data.longitude;

      if (lat == null || lon == null) return;
      if (lat == last_lat && lon == last_lon) return;

      if (last_lat != null && last_lon != null) {
        let distance = gps.Distance(
          this.plugin.data.latitude, 
          this.plugin.data.longitude,
          lat,
          lon
        ) * 1000; // convert from km to m

        distance = Math.round((distance + Number.EPSILON) * 100) / 100;

        this.plugin.logger.info(`Location updated (moved ${distance} m).`);
      }

      this.plugin.data.latitude = lat;
      this.plugin.data.longitude = lon;
      
    });
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