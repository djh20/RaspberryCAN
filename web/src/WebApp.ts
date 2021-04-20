import { Page, PageManager } from "./Page";
import Catalog from './Catalog';
import { Metric, Vehicle } from "./Vehicle";
import EventEmitter from 'events';

export default class WebApp extends EventEmitter {
  public page: Page; 
  public ws: WebSocket;
  public catalog: Catalog;
  public vehicle: Vehicle;
  public pm: PageManager;

  constructor() {
    super();
    this.catalog = new Catalog();
    this.vehicle = new Vehicle();
    this.pm = new PageManager();
  }

  public async connect(ip: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let ws = new WebSocket(`ws://${ip}`);

      ws.onopen = () => {
        this.ws = ws;
        resolve();
      }

      ws.onerror = () => reject();
    });
  }

  public load(page: Page) {
    this.catalog.load();

    let navState = false;
    let menuButton = this.catalog.elements.banner.menuButton;
    let navWrapper = this.catalog.elements.navigation.wrapper;

    this.catalog.elements.status.icon.style.display = 'inline-block';
    this.catalog.elements.status.label.innerText = 'Connected!';

    menuButton.addEventListener('click', () => {
      navState = !navState;
      if (navState) {
        navWrapper.style.width = '270px';
      } else {
        navWrapper.style.width = '';
      }
    });

    if (!page) return;
    page.load();
    this.page = page;

    this.ws.addEventListener('message', (event: MessageEvent<string>) => {
      if (!event.data) return;
      let data: WebSocketData = JSON.parse(event.data);
      this.process(data);
    });
    
    this.ws.send('subscribe_json');
  }

  public process(data: WebSocketData) {
    let metrics: Metric[] = data.metrics;
    if (metrics) {
      metrics.forEach(m => this.vehicle.metrics.set(m.name, m));
      this.emit('metrics_updated', metrics);
    }
  }
}

type WebSocketData = {
  metrics?: Metric[];
}