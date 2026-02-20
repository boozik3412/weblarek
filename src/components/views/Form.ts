import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IFormState {
  valid: boolean;
  errors: string;
}

// Базовый класс формы
export class Form extends Component<IFormState> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this._submit = container.querySelector('[type=submit]') as HTMLButtonElement;
    this._errors = container.querySelector('.form__errors') as HTMLElement;

    container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;
      this.events.emit(`${container.name}:change`, { field, value });
    });

    container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit(`${container.name}:submit`);
    });
  }

  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  set errors(value: string) {
    this._errors.textContent = value;
  }
}

// Форма первого шага: способ оплаты + адрес доставки
export class OrderForm extends Form {
  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;
  protected _addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._cardButton = container.querySelector('[name=card]') as HTMLButtonElement;
    this._cashButton = container.querySelector('[name=cash]') as HTMLButtonElement;
    this._addressInput = container.querySelector('[name=address]') as HTMLInputElement;

    this._cardButton.addEventListener('click', () => {
      this.events.emit('order:change', { field: 'paymentMethod', value: 'card' });
    });

    this._cashButton.addEventListener('click', () => {
      this.events.emit('order:change', { field: 'paymentMethod', value: 'cash' });
    });
  }

  set address(value: string) {
    if (this._addressInput) this._addressInput.value = value;
  }

  set payment(value: 'card' | 'cash' | '') {
    this.setPayment(value);
  }

  setPayment(method: 'card' | 'cash' | ''): void {
    this._cardButton.classList.toggle('button_alt-active', method === 'card');
    this._cashButton.classList.toggle('button_alt-active', method === 'cash');
  }
}

// Форма второго шага: email + телефон
export class ContactsForm extends Form {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this._emailInput = container.querySelector('[name=email]') as HTMLInputElement;
    this._phoneInput = container.querySelector('[name=phone]') as HTMLInputElement;
  }

  set email(value: string) {
    if (this._emailInput) this._emailInput.value = value;
  }

  set phone(value: string) {
    if (this._phoneInput) this._phoneInput.value = value;
  }
}
