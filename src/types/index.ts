export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash' | string; 

export type TCategory =
    | 'софт-скил'
    | 'хард-скил'
    | 'кнопка'
    | 'дополнительное'
    | 'другое';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: TCategory; 
    price: number | null;
}

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export interface IValidationResult {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
}

export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

export interface IOrderRequest {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IOrderResponse {
    id: string;
    total: number;
}

export interface IShopAPI {
    getProductList(): Promise<IProductsResponse>;
    createOrder(order: IOrderRequest): Promise<IOrderResponse>;
}
