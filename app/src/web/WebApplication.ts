import * as p from 'path';
import App from "../app/App";
import express, { Application as ExpressApplication } from 'express'
import Logger from "../util/Logger";

export default class WebApplication {
  public app: App;
  public expressApp: ExpressApplication;

  constructor(app: App) {
    this.app = app;
    this.expressApp = express();
  }

  start() {
    let pages: Page[] = [
      {
        name: 'metrics',
        paths: ['/', '/metrics']
      },
      {
        name: 'map',
        paths: ['/map']
      },
      {
        name: 'settings',
        paths: ['/settings']
      },
      {
        name: 'logs',
        paths: ['/logs']
      }
    ];
    let staticPath = p.resolve(this.app.rootPath, 'web/dist');
    let viewsPath = p.resolve(this.app.rootPath, 'web/views');

    this.expressApp.use(express.static(staticPath));

    this.expressApp.set('views', viewsPath);
    this.expressApp.set('view engine', 'pug');

    pages.forEach(page => page.paths.forEach(path => {

      this.expressApp.get(path, (req, res) => {
        res.render(page.name, {data: {page: page.name, config: this.app.config.data}})
      });

    }));

    //this.expressApp.listen(port, () => Logger.info('Web', `Listening on port ${port}`));
    Logger.info('Web', "Ready!");
  }
}

type Page = {
  name: string;
  paths: string[];
}