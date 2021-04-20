type Elements = {
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
  }
};

export default class Catalog {
  public elements: Elements;

  public load() {
    this.elements = {
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
    }
  }
}