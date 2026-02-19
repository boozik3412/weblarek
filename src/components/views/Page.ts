import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IPage {
  catalog: HTMLElement[];
  counter: number;
  locked: boolean;
}

export class Page extends Component<IPage> {
  protected _catalog: HTMLElement;
  protected _counter: HTMLElement;
  protected _basketButton: HTMLElement;
  protected _wrapper: HTMLElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);

    this._catalog = container.querySelector(".gallery");
    this._counter = container.querySelector(".header__basket-counter");
    this._basketButton = container.querySelector(".header__basket");
    this._wrapper = container.querySelector(".page__wrapper");

    this._basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set catalog(items: HTMLElement[]) {
    this._catalog.replaceChildren(...items);
  }

  set counter(value: number) {
    this._counter.textContent = String(value);
  }

  set locked(value: boolean) {
    if (value) {
      this._wrapper.classList.add("page__wrapper_locked");
    } else {
      this._wrapper.classList.remove("page__wrapper_locked");
    }
  }
}
