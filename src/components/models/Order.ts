import { IOrder, TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class Order implements Omit<IOrder, 'id'> {
  paymentMethod: TPayment | '' = '';
  address: string = '';
  phone: string = '';
  email: string = '';
  items: string[] = [];
  total: number = 0;

  constructor(private events: IEvents) {}

  setPayment(method: TPayment): void {
    this.paymentMethod = method;
    this.events.emit('order:changed', {});
  }

  getPayment(): TPayment | '' {
    return this.paymentMethod;
  }

  setField(field: 'email' | 'phone' | 'address', value: string): void {
    if (field === 'email') this.email = value;
    else if (field === 'phone') this.phone = value;
    else if (field === 'address') this.address = value;
    this.events.emit('order:changed', {});
  }

  validate(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!this.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      errors.email = 'Invalid email format';
    }

    if (!this.phone) {
      errors.phone = 'Phone is required';
    }

    if (!this.address) {
      errors.address = 'Address is required';
    }

    if (!this.paymentMethod) {
      errors.paymentMethod = 'Payment method is required';
    }

    return errors;
  }

  clear(): void {
    this.paymentMethod = '';
    this.address = '';
    this.email = '';
    this.phone = '';
    this.items = [];
    this.total = 0;
  }
}
