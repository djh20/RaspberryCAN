const fs = require('fs');
const p = require('path'); // name set to ps (path system) because 'path' conflicts with other variables
//const express = require('express');
const raspberrycan = require('./modules/raspberrycan');

const CONFIG_PATH = p.resolve(__dirname, 'config.json');
const DEFINITIONS_PATH = p.resolve(__dirname, 'definitions');

//var app = express();

var web_socket;
var can_socket;
var definitions = {};
var values = {};
var definition;
var config;

function init() {
  console.log('-- Reading configuration file...');

  // create a config class instance and call the read method
  config = new raspberrycan.Config(CONFIG_PATH);
  config.read();

  // pull info from config json data
  let can_interface = config.json.can_interface;
  let can_definition = config.json.can_definition;
  
  // use fs to get array of files in definitions folder
  console.log('\n-- Reading can definition files...')
  let definition_files = fs.readdirSync(DEFINITIONS_PATH);

  // iterate through each file and create a CanDefinition instance for each
  definition_files.forEach((file_name) => {
    console.log(`>>> ${file_name}`)
    let path = p.resolve(DEFINITIONS_PATH, file_name); // get full path to file

    let definition = new raspberrycan.CanDefinition(path);
    definition.load(); // load exports data from file

    definitions[definition.id] = definition; // add to definitions dictionary
  });
  console.log();

  definition = definitions[can_definition];

  // connect to can interface if defined in config
  if (can_interface && definition) {
    console.log(`-- Connecting to ${can_interface}...`)
    can_socket = new raspberrycan.CanSocket(can_interface, definition);
    can_socket.connect();
    /*
    console.log(`-- Connecting to can interface: ${can_interface}...`)
    bus = socketcan.createRawChannel(can_interface, true)
    */
  }

  // create the websocket server
  // TODO: add config parameter for websocket enabled
  console.log('-- Creating websocket server...')
  web_socket = new raspberrycan.WebSocketServer();

  console.log();
}

function start() {
  let port = config.json.port || 8080;
  if (can_socket) {
    console.log(`CAN socket listening on ${can_socket.interface_name}...`)
    can_socket.listen();
  }
  // TODO: create http server and use for websocket and express
  if (web_socket) {
    console.log(`WEB socket listening on ws://localhost:${port}`)
    web_socket.listen(port); 
  }
}

init();
start();