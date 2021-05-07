type Elements = {
  overlay: HTMLDivElement,
  status: {
    icon: HTMLImageElement,
    label: HTMLSpanElement
  },
  banner: {
    menuButton: HTMLDivElement
  },
  navigation: {
    wrapper: HTMLDivElement
  },
  metrics: {
    layout: HTMLDivElement
  },
  map: {
    map: HTMLDivElement
  },
  logs: {
    content: HTMLDivElement
  },
};

export default class Catalog {
  public elements: Elements;

  public load() {
    this.elements = {
      overlay: <HTMLDivElement> document.getElementById('overlay'),
      status: {
        icon: <HTMLImageElement> document.getElementById('status-icon'),
        label: <HTMLSpanElement> document.getElementById('status-label')
      },
      banner: {
        menuButton: <HTMLDivElement> document.getElementById('menu-button')
      },
      navigation: {
        wrapper: <HTMLDivElement> document.getElementById('navigation-wrapper')
      },
      metrics: {
        layout: <HTMLDivElement> document.getElementById('metrics')
      },
      map: {
        map: <HTMLDivElement> document.getElementById('map')
      },
      logs: {
        content: <HTMLDivElement> document.getElementById('logs')
      }
    }
  }
}