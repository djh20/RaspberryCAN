import { Page } from "../Page";
import WebApp from "../WebApp";
import { Map as LeafletMap, TileLayer, Polyline} from 'leaflet';

export default class MapPage extends Page {
  private map: LeafletMap;

  constructor(app: WebApp) {
    super(app, 'map');
  }

  public async load() {
    console.log("loading...");

    this.map = new LeafletMap(this.app.catalog.elements.map.map);
    this.map.setView([0, 0], 15);

    let layer = new TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    /*
    let line = new Polyline([
      [0, 0]
    ]).addTo(this.map);
    */
    //let marker = new Marker([0, 0]).addTo(this.map);
    
  }
}