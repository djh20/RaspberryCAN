import { Widget } from "../Page";

export default class CardWidget extends Widget {
  constructor(state: CardWidgetState) {
    super(state);
  }

  build() {
    let card = document.createElement('div');
    card.classList.add('card');

    let title = document.createElement('span');
    title.classList.add('title');
    card.appendChild(title);

    let value = document.createElement('span');
    value.classList.add('value');
    card.appendChild(value);

    this.elements.card = card;
    this.elements.title = title;
    this.elements.value = value;
  }

  updated(prop: string, value: any) {
    switch(prop) {
      case "parent":
        value.appendChild(this.elements.card);
        break;
      case "title":
        this.elements.title.innerText = value;
        break;
      case "value":
        this.elements.value.innerText = value;
        break;
    }
  }
}

type CardWidgetState = {
  title?: string;
  value?: string | number;
  parent?: HTMLElement;
}