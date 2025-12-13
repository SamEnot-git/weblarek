import { Component } from '../base/Component';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import type { IEvents } from '../base/Events';

interface IBasketViewState {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasketViewState> {
	protected list: HTMLElement;
	protected totalElement: HTMLElement;
	protected orderButton: HTMLButtonElement;

	constructor(
		protected events: IEvents,
		template: HTMLTemplateElement
	) {
		super(cloneTemplate<HTMLDivElement>(template));

		this.list = ensureElement<HTMLElement>('.basket__list', this.container);
		this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
		this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

		this.orderButton.addEventListener('click', () => {
			this.events.emit('basket:order');
		});
	}

	set items(nodes: HTMLElement[]) {
		this.orderButton.disabled = nodes.length === 0;
		this.list.textContent = nodes.length === 0 ? 'Корзина пуста' : '';
		this.list.replaceChildren(...nodes);
	}

	set total(value: number) {
		this.totalElement.textContent = `${value} синапсов`;
	}
}



