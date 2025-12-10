import { cloneTemplate } from '../../utils/utils';
import type { IEvents } from '../base/Events';
import type { IProduct } from '../../types/index';
import { Card } from './Card';

interface ICatalogCard {
	product: IProduct;
	inBasket: boolean;
}

export class CatalogCard extends Card {
	constructor(
		protected events: IEvents,
		template: HTMLTemplateElement
	) {
		super(cloneTemplate<HTMLButtonElement>(template));

		this.container.addEventListener('click', () => {
			if (this.currentProduct) {
				this.events.emit('card:select', { id: this.currentProduct.id }); // ✔
			}
		});
	}

	render(data: ICatalogCard): HTMLElement {
		super.render(data);
		return this.container;
	}
}
