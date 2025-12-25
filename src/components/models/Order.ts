import { IProduct, IOrder, IBuyer } from '../../types/index';

export class Order implements IOrder {
  id: string = '';
  items: IProduct[] = [];
  total: number = 0;
  paymentMethod: string = '';
  address: string = '';
  phone: string = '';
  email: string = '';
  status: string = '';

  constructor(buyer: IBuyer, items: IProduct[], total: number) {
    this.items = items;
    this.total = total;
    this.phone = buyer.phone;
    this.email = buyer.email;
    this.address = buyer.address;
  }

  setPayment(method: string): void {
    this.paymentMethod = method;
  }

  getPayment(): string {
    return this.paymentMethod;
  }

  setStatus(status: string): void {
    this.status = status;
  }

  getStatus(): string {
    return this.status;
  }

  getTotal(): number {
    return this.total;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getBuyer() {
    return {
      phone: this.phone,
      email: this.email,
      address: this.address
    };
  }
}
