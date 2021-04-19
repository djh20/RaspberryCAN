import * as p from 'path';
import FileSystem from '../util/FileSystem';
import Vehicle, { VehicleDefinition } from "../vehicle/Vehicle";
import Config from './Config';
import WebSocketServer from '../web/WebSocket';
import GpsModule from '../vehicle/Gps';
import WebApplication from '../web/WebApplication';
import { Server as HttpServer } from 'http';
import Logger from '../util/Logger';

export default class App {
  public rootPath: string;
  public vehicle: Vehicle;
  public server: HttpServer;
  public ws: WebSocketServer;
  public config: Config;
  public webApp: WebApplication;

  private definitionsPath: string;
  private configPath: string;

  constructor() {
    this.vehicle = new Vehicle();
    this.rootPath = p.resolve(__dirname, '../../../');

    this.definitionsPath = p.resolve(this.rootPath, 'definitions');
    this.configPath = p.resolve(this.rootPath, 'config.json');

    this.config = new Config(this.configPath);
    this.ws = new WebSocketServer(this);
    this.webApp = new WebApplication(this);
    this.server = new HttpServer(this.webApp.expressApp);
  }

  async start() {
    await this.config.load();

    // TODO: move this connection logic into the vehicle class (under a connect() method).
    // this would allow multiple vehicles instances to be running at the same time.
    
    let definitions = await this.getDefinitions();
    let definition = definitions.find(d => d.id == this.config.data.canDefinition);
    
    if (definition) {
      this.vehicle.setDefinition(definition);
      this.vehicle.can.connect(this.config.data.canInterface);
      this.vehicle.can.listen();
    }

    let gpsPort = this.config.data.gpsPort;
    if (gpsPort) {
      this.vehicle.gps = new GpsModule(this.vehicle);

      let connected = await this.vehicle.gps.connect(gpsPort);
      if (connected) this.vehicle.gps.listen();
    }

    let port = this.config.data.port;
    this.server.listen(port, () => {
      Logger.info('Server', `Listening on port ${port}`);
      this.ws.start(this.server);
      this.webApp.start();
    });
  }

  async getDefinitions(): Promise<VehicleDefinition[]> {
    let directory = await FileSystem.readDirectory({path: this.definitionsPath});
    return directory.children.map(child => require(child.path));
  }
}