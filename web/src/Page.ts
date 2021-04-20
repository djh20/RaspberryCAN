import WebApp from "./WebApp";

export abstract class Page {
  public name: string;
  protected app: WebApp;

  constructor(app: WebApp, name: string) {
    this.app = app;
    this.name = name;
  }

  public abstract load(): void;
}

export class PageManager {}

/*
export abstract class Widget {
  public parent: HTMLElement;
  public element: HTMLElement;

  constructor(parent: HTMLElement) {
    this.parent = parent;
  }

  public abstract build(): void;
}
*/

export abstract class Widget {
  public state: object;
  protected elements: any;

  constructor(state: object) {
    this.state = state;
    this.elements = {};
    this.build();
    this.update();
  }

  protected update() {
    for (let prop in this.state) {
      let value = this.state[prop];
      this.updated(prop, value);
    }
  }

  public setState(newState: object) {
    for (let prop in newState) {
      let newValue = newState[prop];
      let oldValue = this.state[prop];
      if (newValue == oldValue) continue;

      this.state[prop] = newState[prop];
      this.updated(prop, newValue);
    }
  }

  public abstract build();
  protected abstract updated(prop: string, value: any);
}