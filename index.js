const fs = require('fs');
const path = require('path');
const express = require('express');
const socketcan = require('socketcan');

const CONFIG_PATH = path.resolve(__dirname, 'config.json');

var app = express();
var config = JSON.parse( fs.readFileSync(CONFIG_PATH, 'utf-8') );
var bus = socketcan.createRawChannel("vcan0", true);

const PORT = config.port || 80;

