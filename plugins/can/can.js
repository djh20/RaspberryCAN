/*
  CAN Plugin

  Reads data from a CAN interface.
*/

const socketcan = require('socketcan');
const fs = require('fs');
const p = require('path');

class CanPlugin {
  constructor() {
    this.definitions = [];
  }

  async register(plugin) {
    plugin.data.metrics = [];

    let interface_name = plugin.config.interface;

    // check that interface and definition are both defined
    if (!interface_name) {
      plugin.logger.error('No interface defined in plugin configuration.');
      return false;
    }
    if (!plugin.config.definition) {
      plugin.logger.error('No definition defined in plugin configuration.');
      return false;
    }

    let definitions_path = p.resolve(__dirname, 'definitions');
    let definitions_dir = await plugin.manager.app.fileManager.readDirectory({path: definitions_path});

    for (let name of definitions_dir.children) {
      let path = p.resolve(definitions_path, name);
      let definition = require(path);
      this.definitions[definition.id] = definition;
    }

    // create the socketcan channel for reading can data
    try {
      this.channel = socketcan.createRawChannel(interface_name, true);
    } catch (err) {
      plugin.logger.error("Failed to create socket");
      return false;
    }

    this.plugin = plugin;

    return true;
  }

  start() {
    let selected_definition = this.plugin.config.definition;
    this.definition = this.definitions[selected_definition];

    this.channel.addListener('onMessage', (frame) => this.processFrame(frame));
    this.channel.start();
  }

  processFrame(frame) {
    // when a frame is recieved, find matching message in the definition file.
    let message = this.definition.messages.find(msg => msg.id == frame.id);
    if (!message) return;

    // iterate through each message point
    message.points.forEach((point) => {
      // get metric for the point, or create one.
      let metric = this.plugin.data.metrics[point.name];
      if (!metric) {
        metric = new CanMetric(point);
        this.plugin.data.metrics[point.name] = metric;
      }

      // if the metric has a interval param, make sure it's been long enough.
      if (metric.interval) {
        let timeSinceLastUpdate = Date.now() - metric.lastUpdate;
        if (timeSinceLastUpdate < metric.interval) return;
      }

      // get metric value from frame data
      let val = metric.process(frame.data);
      val = Math.round((val + Number.EPSILON) * 100) / 100;
      
      // check that the value has changed, then emit metricUpdated event.
      if (val != metric.value) {
        metric.value = val;
        this.plugin.emit('metricUpdated', metric);
      }

      metric.lastUpdate = Date.now();
    });
  }
}

class CanMetric {
  constructor(point) {
    this.id = point.id;
    this.name = point.name;
    this.process = point.process;
    this.convert = point.convert;
    this.interval = point.interval;
    this.log = point.log !== false
    this.value = 0;
    this.lastUpdate = 0;
  }

  asByteArray() {
    let data = this.convert ? this.convert(this.value) : new Uint8Array([this.value]);
    
    if (data.byteLength >= 2) {
      data = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    }

    let merged = new Uint8Array(data.length + 1);
    merged.set(new Uint8Array([this.id]));
    merged.set(data, 1);
    
    return merged
  }
}

module.exports = new CanPlugin();