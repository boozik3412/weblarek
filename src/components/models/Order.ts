import { TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class Order {
	private _paymentMethod: TPayment | '' = '';
	private _address: string = '';
	private _phone: string = '';
	private _email: string = '';

	constructor(private events: IEvents) {}

	setPayment(method: TPayment): void {
		this._paymentMethod = method;
		this.events.emit('order:changed', {});
	}

	getPayment(): TPayment | '' {
		return this._paymentMethod;
	}

	setField(field: 'email' | 'phone' | 'address', value: string): void {
		if (field === 'email') this._email = value;
		else if (field === 'phone') this._phone = value;
		else if (field === 'address') this._address = value;
		this.events.emit('order:changed', {});
	}

	validate(): Record<string, string> {
		const errors: Record<string, string> = {};

		if (!this._email) {
			errors.email = 'Email is required';
		}

		if (!this._phone) {
			errors.phone = 'Phone is required';
		}

		if (!this._address) {
			errors.address = 'Address is required';
		}

		if (!this._paymentMethod) {
			errors.paymentMethod = 'Payment method is required';
		}

		return errors;
	}

	clear(): void {
		this._paymentMethod = '';
		this._address = '';
		this._email = '';
		this._phone = '';
		this.events.emit('order:changed', {});
	}

	get address(): string {
		return this._address;
	}

	get email(): string {
		return this._email;
	}

	get phone(): string {
		return this._phone;
	}
}
