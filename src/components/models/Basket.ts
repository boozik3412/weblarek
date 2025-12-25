import { IProduct } from '../../types/index';

export class Basket {
  private _items: IProduct[] = [];

  getItems(): IProduct[] {
    return this._items;
  }

  addItem(item: IProduct): void {
    const existingItem = this._items.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 0) + 1;
    } else {
      this._items.push({ ...item, quantity: 1 });
    }
  }

  removeItem(itemId: string): void {
    this._items = this._items.filter(item => item.id !== itemId);
  }

  clear(): void {
    this._items = [];
  }

  getTotal(): number {
    return this._items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  }

  getCount(): number {
    return this._items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  hasItem(itemId: string): boolean {
    return this._items.some(item => item.id === itemId);
  }
}
