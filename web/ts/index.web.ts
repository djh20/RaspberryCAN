import 'leaflet'
import '../sass/main';
import 'leaflet/dist/leaflet.css'

import { Page } from './Page';
import WebApp from './WebApp';
import MetricsPage from './pages/MetricsPage';
import MapPage from './pages/MapPage';
import LogsPage from './pages/LogsPage';

const app = new WebApp();
const ip = location.host;
const pageMeta = <HTMLMetaElement> document.getElementById('page-meta');
const pageName = pageMeta.getAttribute('name');

const pages: Page[] = [
  new MetricsPage(app),
  new MapPage(app),
  new LogsPage(app)
];

window.addEventListener('load', () => {
  const page = pages.find(p => p.name == pageName);

  app.init();  
  app.connect(ip)
    .then(() => {
      console.log("Connected!");
      app.load(page);
    })
    .catch(err => {
      console.log("Failed to connect!");
      console.log(err);
      // TODO: show error on page
    });
});