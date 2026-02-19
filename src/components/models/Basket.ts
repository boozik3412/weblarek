import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class Basket {
    private _items: IProduct[] = [];

    constructor(private events: IEvents) {}

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(item: IProduct): void {
        if (!this.hasItem(item.id)) {
            this._items.push(item);
            this.events.emit('basket:changed', { items: this._items });
        }
    }

    removeItem(itemId: string): void {
        this._items = this._items.filter((item) => item.id !== itemId);
        this.events.emit('basket:changed', { items: this._items });
    }

    clear(): void {
        this._items = [];
        this.events.emit('basket:changed', { items: this._items });
    }

    getTotal(): number {
        return this._items.reduce(
            (sum, item) => sum + (item.price ?? 0),
            0
        );
    }

    getCount(): number {
        return this._items.length;
    }

    hasItem(itemId: string): boolean {
        return this._items.some((item) => item.id === itemId);
    }
}
