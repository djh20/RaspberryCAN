import * as p from 'path';
import App from './app';

let app = new App({
  configPath: p.resolve(__dirname, "../config.json")
});

app.init();