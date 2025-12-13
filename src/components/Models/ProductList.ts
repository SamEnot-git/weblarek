import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';

export class ProductList {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  constructor(private events: IEvents) {}
  
  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('catalog:changed');
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setSelectedItem(item: IProduct | null | undefined): void {
    this.selectedItem = item ?? null;
    this.events.emit('product:selected');
  }

  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}

