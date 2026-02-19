import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasketView {
  items: HTMLElement[];
  total: number;
}

export class BasketView extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);

    this._list = container.querySelector(".basket__list") as HTMLElement;
    this._total = container.querySelector(".basket__price") as HTMLElement;
    this._button = container.querySelector(
      ".basket__button"
    ) as HTMLButtonElement;
    if (this._button) {
      this._button.addEventListener("click", () => {
        this.events.emit("order:start");
      });
    }
  }

  set items(items: HTMLElement[]) {
    if (items.length === 0) {
      this._list.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
      this._button.disabled = true;
    } else {
      this._list.replaceChildren(...items);
      this._button.disabled = false;
    }
  }

  set total(value: number) {
    this._total.textContent = `${value} синапсов`;
  }
}
