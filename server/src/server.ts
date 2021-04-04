import express from 'express';
import path from 'path';
import fs from 'fs';

import { Config } from './interfaces';

// read the config using fs and use the config interface type (this allows for autocomplete)
const CONFIG_PATH = path.resolve(__dirname, '../../config.json');
const CONFIG: Config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

// use port from config, otherwise default (80)
const PORT = CONFIG.port || 80;
const CLIENT_PATH = path.resolve(__dirname, '../../client/dist');
const VIEWS_PATH = path.resolve(CLIENT_PATH, 'views');
const STATIC_PATH = path.resolve(CLIENT_PATH, 'public');

var app = express();

app.use(express.static(STATIC_PATH));
app.set('view engine', 'pug');
app.set('views', VIEWS_PATH);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
});

app.get('/', (req, res) => {
  res.render('home', { config: CONFIG });
});