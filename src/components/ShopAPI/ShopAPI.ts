import { IApi, IProductsResponse, IOrderRequest, IOrderResponse, IShopAPI } from '../../types';

export class ShopAPI implements IShopAPI {
  constructor(private baseApi: IApi) {}

  /**
   * Получить список товаров с сервера
   */
  async getProductList(): Promise<IProductsResponse> {
    try {
      const response = await this.baseApi.get<IProductsResponse>('/product');
      return response;
    } catch (error) {
      console.error('Ошибка при получении списка товаров:', error);
      throw error;
    }
  }

  /**
   * Отправить заказ на сервер
   */
  async createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    try {
      const response = await this.baseApi.post<IOrderResponse>('/order', order);
      return response;
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      throw error;
    }
  }
}