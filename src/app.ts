import * as p from 'path';
import Config from './config'
import AppPluginManager from './plugin';

export default class App {
  public config: Config;
  public pluginManager: AppPluginManager;

  constructor(params: {configPath: string}) {
    this.config = new Config(params.configPath);
    this.pluginManager = new AppPluginManager(this);
  }

  public async init() {
    console.log("----- RaspberryCAN -----");
    await this.config.load();
    await this.pluginManager.loadPlugins();
  }
}