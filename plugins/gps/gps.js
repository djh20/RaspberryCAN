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
    plugin.data.latitude = 0;
    plugin.data.longitude = 0;

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
    let parser = this.socket.pipe(new Readline({ delimiter: '\r\n' }));

    parser.on('data', (data) => {
      this.device.update(data);
    });

    this.device.on('data', () => {
      let lat = this.device.state.lat;
      let lon = this.device.state.lon;
      if (!lat || !lon) return;
      if (lat == this.plugin.data.latitude && lon == this.plugin.data.longitude) return;

      let distance = gps.Distance(
        this.plugin.data.latitude, 
        this.plugin.data.longitude,
        lat,
        lon
      );

      this.plugin.logger.info(`Location updated (moved ${distance} km).`);
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