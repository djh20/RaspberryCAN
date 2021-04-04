const can = require('./can');
const config = require('./config');
const websocket = require('./websocket');

module.exports = {
  CanSocket: can.CanSocket,
  CanDefinition: can.CanDefinition,
  Config: config.Config,
  WebSocketServer: websocket.WebSocketServer
};