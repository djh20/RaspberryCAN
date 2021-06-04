import App from './app/App';
import Logger from './util/Logger';

const VERSION = "2021.06-1d";

console.log(`RaspberryCAN (${VERSION})`)
Logger.info('App', `Starting...`);

const app = new App(VERSION);
app.start();