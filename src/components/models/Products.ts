import { IProduct } from "../../types";

export class Products {
  private _items: IProduct[] = [];
  private _preview: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this._items = items;
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getItem(id: string): IProduct | undefined {
    return this._items.find((item) => item.id === id);
  }

  setPreview(product: IProduct): void {
    this._preview = product;
  }

  getPreview(): IProduct | null {
    return this._preview;
  }
}
