const EventEmitter = require('events').EventEmitter;
const socketcan = require('socketcan');

class CanSocket extends EventEmitter {
  constructor(interface_name, definition) {
    super();
    this.interface_name = interface_name;
    this.definition = definition;
    this.channel = null;
    this.metrics = {};
  }
  
  connect() {
    this.channel = socketcan.createRawChannel(this.interface_name, true);
    this.metrics = {};

    if (!this.definition) return;

    this.definition.messages.forEach((msg) => {
      if (!msg.values) return;

      msg.values.forEach((value) => {
        let metric = new CanMetric(this, value);
        this.metrics[value.name] = metric;
      });
    });
  }

  listen() {
    if (!this.channel) return;

    this.channel.addListener('onMessage', (frame) => {
      if (!this.definition || !this.definition.messages) return;
      
      for (let msg of this.definition.messages) {
        if (frame.id == msg.id && msg.values) {
          this.process(frame, msg.values);
        }
      }
    });

    this.channel.start();
  }

  process(frame, values) {
    for (let value of values) {
      let metric = this.metrics[value.name];
      if (metric) metric.update(frame);
    }
  }
}

class CanMetric {
  constructor(socket, params) {
    this.socket = socket;
    this.id = params.id;
    this.name = params.name;
    this.process = params.process;
    this.convert = params.convert;
    this.log = params.log === false ? false : true;
    this.value = 0;
  }

  update(frame) {
    let val = this.process(frame.data);
    if (val != this.value) { 
      this.value = val;
      this.socket.emit('update', this);
    }
  }

  asByteArray() {
    //let id_array = new Uint8Array([this.id]);
    //let value_array = this.convert ? this.convert(this.value) : new Uint8Array([this.value]);
    //let array = new Uint8Array(value_array.buffer, value_array.byteOffset, value_array.byteLength);

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

class CanDefinition {
  constructor(path) {
    this.path = path;
    this.id = null;
    this.name = null;
    this.messages = {};
  }

  load() {
    let exports = require(this.path);
    this.id = exports.id;
    this.name = exports.name;
    this.messages = exports.messages || {};
  }
}

module.exports = {CanSocket, CanDefinition}