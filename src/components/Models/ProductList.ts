import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';

export class ProductList {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  constructor(private events: IEvents) {}

  // сохранить массив товаров и сообщить презентеру
  setItems(items: IProduct[]): void {
    this.items = items;
    // уведомляем презентер, что каталог обновился
    this.events.emit('catalog:changed', {} as object);
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  // сохранить выбранный товар и сообщить презентеру
  setSelectedItem(item: IProduct | null | undefined): void {
    this.selectedItem = item ?? null;
    // уведомляем, что выбранный товар изменился
    this.events.emit('product:selected', {} as object);
  }

  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}
