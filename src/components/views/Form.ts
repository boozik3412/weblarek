import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IFormState {
    valid: boolean;
    errors: string;
}

// Базовый класс формы
export class Form extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, private events: IEvents) {
        super(container);

        this._submit = container.querySelector('[type=submit]');
        this._errors = container.querySelector('.form__errors');

        container.addEventListener('input', (e: InputEvent) => {
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
        this._submit
