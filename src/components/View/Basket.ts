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

	set items(products: IProduct[]) {
	this.list.replaceChildren();

	if (products.length === 0) {
		this.orderButton.disabled = true;
		this.list.textContent = 'Корзина пуста';
		return;
	}

	this.orderButton.disabled = false;

	const nodes = products.map((product, index) => {
		const item = new BasketItem(this.events, this.itemTemplate);

		return item.render({
			id: product.id,
			title: product.title,
			price: product.price,
			index: index + 1,
		});
	});

	this.list.replaceChildren(...nodes);
}	

	set total(value: number) {
		this.totalElement.textContent = `${value} синапсов`;
	}	
}

