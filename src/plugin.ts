import { EventEmitter } from 'events';
import * as p from 'path';
import App from "./app";
import FileManager from './filemanager';
import Logger from './logger';

export default class AppPluginManager extends EventEmitter {
  public app: App;
  public path: string;
  public plugins: AppPlugin[];

  private logger: Logger;

  constructor(app: App) {
    super();
    this.app = app;
    this.path = p.resolve(__dirname, '../plugins');
    this.plugins = [];
    this.logger = new Logger('Plugins');
  }
  
  public async loadPlugins() {
    this.logger.info('Loading plugins...');

    // read the plugin directory
    let directory = await FileManager.readDirectory({path: this.path});

    // iterate through each child and create an AppPlugin instance for it
    for (let name of directory.children) {
      // get plugin config from main config
      let config = this.app.config.data.plugins[name];
      if (!config || !config.enabled) continue;

      let plugin = new AppPlugin(this, {
        name: name, 
        path: p.resolve(this.path, name), 
        config: config
      });
      this.plugins.push(plugin);
      await plugin.load(); // load the plugin
    }
  }
}

export class AppPlugin {
  public name: string;
  public path: string;
  public logger: Logger;

  private manager: AppPluginManager;
  private instance?: AppPluginStructure;
  private config?: any;

  constructor(manager: AppPluginManager, params: {name: string, path: string, config: any}) {
    this.manager = manager;
    this.name = params.name;
    this.path = params.path;
    this.config = params.config;
    this.logger = new Logger(`Plugin: ${params.name}`);
  }

  public async load() {
    let index_path = p.resolve(this.path, `${this.name}.js`);

    let index_exists = await FileManager.exists({path: index_path});
    if (!index_exists) return;
    
    // require the index file as type AppPluginStructure
    let plugin_instance: AppPluginStructure = require(index_path);
    if (!plugin_instance) return;

    // call the register method on the plugin instance
    plugin_instance.register(this);

    this.instance = plugin_instance;
  }
}

// this interface describes the structure of a plugin index file.
// if you're creating a plugin, this is a good way to see how you should structure the index file.
interface AppPluginStructure {
  plugin: AppPlugin;
  register(plugin: AppPlugin): void
}