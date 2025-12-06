import { IProduct } from '../../types';

export class Cart {
  private items: IProduct[] = [];

  // Получение массива товаров в корзине
  getItems(): IProduct[] {
    return this.items;
  }

  // Добавление товара в корзину
  addItem(item: IProduct): void {
    this.items.push(item);
  }

  // Удаление товара из корзины
  removeItem(item: IProduct): void {
    const index = this.items.findIndex(cartItem => cartItem.id === item.id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  // Очистка корзины
  clear(): void {
    this.items = [];
  }

  // Получение стоимости всех товаров в корзине
  getTotal(): number {
    return this.items.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  }

  // Получение количества товаров в корзине
  getCount(): number {
    return this.items.length;
  }

  // Проверка наличия товара в корзине по его id
  hasItem(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}