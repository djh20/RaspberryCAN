const socketcan = require('socketcan');

class CanSocket {
  constructor(interface_name, definition) {
    this.interface_name = interface_name;
    this.definition = definition;
    this.channel = null;
    this.values = {};
  }
  
  connect() {
    this.channel = socketcan.createRawChannel(this.interface_name, true);
  }

  listen() {
    if (!this.channel) return;

    this.channel.addListener('onMessage', (frame) => {
      if (!this.definition || !this.definition.messages) return;
      
      for (let msg of this.definition.messages) {
        if (frame.id == msg.id && msg.signals) {
          this.process(frame, msg.signals);
        }
      }
    });

    this.channel.start();
  }

  process(frame, signals) {
    for (let signal of signals) {
      if (!signal.process) continue;
  
      let value = signal.process(frame.data);
      if (value != this.values[signal.name]) {
        this.values[signal.name] = value;
        console.log(`> ${signal.name}: ${value}`)
      }
    }
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