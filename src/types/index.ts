export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Типы для моделей данных
export type TPayment = 'card' | 'cash';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment?: TPayment;    // ← ИСПРАВЛЕНО: опционально
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends IBuyer {
  id?: string;           // ← ДОБАВЛЕНО: ID заказа
  items: string[];
  total: number;
}

export interface IOrderResponse {  // ← ПЕРЕИМЕНОВАНО (было IOrderResult)
  id: string;
  total: number;
}

export interface IProductsResponse {
  items: IProduct[];
  total: number;
}

// ← ДОБАВЛЕНО: для валидации форм
export interface IFormErrors {
  [key: string]: string;
}
