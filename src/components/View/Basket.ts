import { Component } from '../base/Component';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import type { IEvents } from '../base/Events';
import type { IProduct } from '../../types/index';
import { BasketItem } from './BasketItem';

interface IBasket {
	items: IProduct[];
	total: number;
}

export class Basket extends Component<IBasket> {
	protected list: HTMLElement;
	protected totalElement: HTMLElement;
	protected orderButton: HTMLButtonElement;
	protected itemTemplate: HTMLTemplateElement;

	constructor(
		protected events: IEvents,
		template: HTMLTemplateElement,
		itemTemplate: HTMLTemplateElement
	) {
		super(cloneTemplate<HTMLDivElement>(template));

		this.list = ensureElement<HTMLElement>('.basket__list', this.container);
		this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
		this.orderButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);
		this.itemTemplate = itemTemplate;

		this.orderButton.addEventListener('click', () => {
			this.events.emit('basket:order');
		});
	}

	render(data: IBasket): HTMLElement {
		const { items, total } = data;

		this.list.replaceChildren();

		if (!items.length) {
			this.orderButton.disabled = true;
			this.list.textContent = 'Корзина пуста';
		} else {
			this.orderButton.disabled = false;
			const nodes = items.map((product, index) => {
				const item = new BasketItem(this.events, this.itemTemplate);
				return item.render({ product, index: index + 1 });
			});
			this.list.replaceChildren(...nodes);
		}

		this.totalElement.textContent = `${total} синапсов`;

		return this.container;
	}
}
