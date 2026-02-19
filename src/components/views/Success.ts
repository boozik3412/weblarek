import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected _description: HTMLElement;
    protected _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);

        this._description = container.querySelector('.order-success__description') as HTMLElement;
        this._closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;

        this._closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set total(value: number) {
        this._description.textContent = `Списано ${value} синапсов`;
    }
}
