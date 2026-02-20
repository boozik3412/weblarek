import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Products {
    private _items: IProduct[] = [];
    private _preview: IProduct | null = null;

    constructor(private events: IEvents) {}

    setItems(items: IProduct[]): void {
        this._items = items;
        this.events.emit('catalog:changed', { items: this._items });
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getItem(id: string): IProduct | undefined {
        return this._items.find((item) => item.id === id);
    }

    setPreview(product: IProduct): void {
        this._preview = product;
        this.events.emit('preview:changed', { product: this._preview });
    }

    getPreview(): IProduct | null {
        return this._preview;
    }

    getSelectedProduct(): IProduct | null {
        return this._preview;
    }
}
