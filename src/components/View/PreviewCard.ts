import { cloneTemplate, ensureElement } from '../../utils/utils';
import type { IEvents } from '../base/Events';
import type { IProduct } from '../../types';
import { Card } from './Card';

interface IPreviewCard {
	product: IProduct;
	inBasket: boolean;
}

export class PreviewCard extends Card {
	protected description: HTMLElement;
	protected inBasket = false; // флаг, в корзине ли товар

	constructor(
		protected events: IEvents,
		template: HTMLTemplateElement
	) {
		super(cloneTemplate<HTMLDivElement>(template));

		this.description = ensureElement<HTMLElement>('.card__text', this.container);

		if (this.button) {
			this.button.addEventListener('click', (event) => {
				event.stopPropagation();
				if (!this.currentProduct || this.currentProduct.price === null) return;

				if (this.inBasket) {
					// товар уже в корзине — удаляем
					this.events.emit('card:remove', { id: this.currentProduct.id });
				} else {
					// товара нет в корзине — добавляем
					this.events.emit('card:add', { id: this.currentProduct.id });
				}
			});
		}
	}

	render(data: IPreviewCard): HTMLElement {
		super.render(data);

		this.description.textContent = data.product.description;
		this.inBasket = data.inBasket;
		
		if (this.button) {
			this.button.textContent = this.inBasket
				? 'Удалить из корзины'
				: 'В корзину';
		}

		return this.container;
	}
}

