import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";
import { IEvents } from '../base/Events';

// Базовый класс карточки
export class Card extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _category?: HTMLElement;
  protected _image?: HTMLImageElement;

  constructor(container: HTMLElement) {
    super(container);
    this._title = container.querySelector(".card__title");
    this._price = container.querySelector(".card__price");
    this._category = container.querySelector(".card__category");
    this._image = container.querySelector(".card__image");
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set price(value: number | null) {
    this._price.textContent = value !== null ? `${value} синапсов` : "Бесценно";
  }

  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
      // Сбрасываем все классы категорий и ставим нужный
      Object.values(categoryMap).forEach((cls) => {
        this._category.classList.remove(cls);
      });
      const categoryClass = categoryMap[value];
      if (categoryClass) {
        this._category.classList.add(categoryClass);
      }
    }
  }

  set image(value: string) {
    if (this._image) {
      this._image.src = value;
      this._image.alt = "";
    }
  }
}

// Карточка для каталога (gallery__item)
export class CardCatalog extends Card {
  constructor(container: HTMLElement, onClick: () => void) {
    super(container);
    container.addEventListener("click", onClick);
  }
}

// Карточка для превью (полная карточка с кнопкой)
export class CardPreview extends Card {
  protected _button: HTMLButtonElement;
  protected _text: HTMLElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this._button = container.querySelector(".card__button");
    this._text = container.querySelector(".card__text");
  }

  set description(value: string) {
    if (this._text) {
      this._text.textContent = value;
    }
  }

  setButtonState(inBasket: boolean, hasPrice: boolean): void {
    if (!hasPrice) {
      this._button.textContent = "Недоступно";
      this._button.disabled = true;
    } else if (inBasket) {
      this._button.textContent = "Удалить из корзины";
      this._button.disabled = false;
    } else {
      this._button.textContent = "В корзину";
      this._button.disabled = false;
    }
  }

  setOnButtonClick(handler: () => void): void {
    this._button.addEventListener("click", handler);
  }
}

// Карточка для корзины (компактная, со счётчиком)
export class CardBasket extends Card {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, onDelete: () => void) {
    super(container);
    this._index = container.querySelector(".basket__item-index");
    this._deleteButton = container.querySelector(".basket__item-delete");
    this._deleteButton.addEventListener("click", onDelete);
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }
}
