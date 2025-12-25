import { IApi } from '../../types/index';
import { IProduct } from '../../types/index';

export interface IProductsResponse {
  items: IProduct[];
}

export interface IOrderResponse {
  id: string;
}

export class LarekAPI {
  constructor(private api: IApi) {}

  getProducts(): Promise<IProduct[]> {
    return this.api.get('/product/').then((data: IProductsResponse) => data.items);
  }

  postOrder(order: any): Promise<IOrderResponse> {
    return this.api.post('/order/', order) as Promise<IOrderResponse>;
  }
}
