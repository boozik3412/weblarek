import { IProduct } from "../../types/index";

export class Basket {
  private _items: IProduct[] = [];

  getItems(): IProduct[] {
    return this._items;
  }

  addItem(item: IProduct): void {
    if (!this.hasItem(item.id)) {
      this._items.push(item);
    }
  }
  

  removeItem(itemId: string): void {
    this._items = this._items.filter((item) => item.id !== itemId);
  }

  clear(): void {
    this._items = [];
  }

  getTotal(): number {
    return this._items.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
  }

  getCount(): number {
    return this._items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  hasItem(itemId: string): boolean {
    return this._items.some((item) => item.id === itemId);
  }
}
