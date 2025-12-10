import { cloneTemplate, ensureElement } from '../../utils/utils';
import type { IEvents } from '../base/Events';
import type { IProduct } from '../../types/index';
import { Card } from './card';

interface IBasketItem {
	index: number;
	product: IProduct;
}

export class BasketItem extends Card {
	protected indexElement: HTMLElement;
	protected deleteButton: HTMLButtonElement;

	constructor(
		protected events: IEvents,
		template: HTMLTemplateElement
	) {
		super(cloneTemplate<HTMLLIElement>(template));

		this.indexElement = ensureElement<HTMLElement>(
			'.basket__item-index',
			this.container
		);
		this.deleteButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this.container
		);

		this.deleteButton.addEventListener('click', (event) => {
			event.stopPropagation();
			if (this.currentProduct) {
				this.events.emit('basket:remove', { id: this.currentProduct.id });
			}
		});
	}

	render(data: IBasketItem): HTMLElement {
		super.render({ product: data.product, inBasket: true });
		this.indexElement.textContent = String(data.index);
		this.deleteButton.textContent = '';
		return this.container;
	}
}

