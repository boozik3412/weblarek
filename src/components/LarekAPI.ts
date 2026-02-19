import { IApi, IProduct, IOrder, IOrderResponse, IProductsResponse } from '../types';

export class LarekAPI {
  constructor(private api: IApi) {}

  getProducts(): Promise<IProduct[]> {
    return this.api.get<IProductsResponse>('/product/').then((data: IProductsResponse) => data.items);
  }

  postOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', order);
  }
}
