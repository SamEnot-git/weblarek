
import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';

export class Cart {
	private items: IProduct[] = [];
	private events: IEvents;

	constructor(events: IEvents) {
		this.events = events; 
	}

	private emitChange() {
		this.events.emit('cart:changed', {} as object);
	}

	// Получение массива товаров в корзине
	getItems(): IProduct[] {
		return this.items;
	}

	// Добавление товара в корзину
	addItem(item: IProduct): void {
		this.items.push(item);
		this.emitChange();
	}

	// Удаление товара из корзины
	removeItem(item: IProduct): void {
		const index = this.items.findIndex(cartItem => cartItem.id === item.id);
		if (index !== -1) {
			this.items.splice(index, 1);
			this.emitChange();
		}
	}

	// Очистка корзины
	clear(): void {
		this.items = [];
		this.emitChange();
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
