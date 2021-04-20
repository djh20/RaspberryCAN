import './sass/style';
import 'typeface-roboto';
import { Page, PageManager } from './Page';
import WebApp from './WebApp';
import MetricsPage from './pages/MetricsPage';

const app = new WebApp();
const ip = location.host;
const pageMeta = <HTMLMetaElement> document.getElementById('page-meta');
const pageName = pageMeta.getAttribute('name');

const pages: Page[] = [
  new MetricsPage(app)
];

window.addEventListener('load', () => {
  const page = pages.find(p => p.name == pageName);

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