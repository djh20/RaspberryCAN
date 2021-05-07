import { Page } from "../Page";
import WebApp from "../WebApp";
import CardWidget from "../widgets/CardWidget";

export default class LogsPage extends Page {
  constructor(app: WebApp) {
    super(app, 'logs');
  }

  public async load() {
    let response = await fetch('/api/logs');
    let logs: LogMessage[] = await response.json();
    logs.reverse();
    logs.forEach(log => {
      new CardWidget({
        title: `${log.type} (${log.prefix})`,
        value: log.message,
        parent: this.app.catalog.elements.logs.content
      });
    });
  }
}

type LogMessage = {
  type: string;
  prefix: string;
  message: string;
}