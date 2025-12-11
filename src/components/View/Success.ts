import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

interface ISuccess {
	total: number;
}

export class Success extends Component<ISuccess> {
	protected description: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(
		protected events: IEvents,
		template: HTMLTemplateElement
	) {
		super(cloneTemplate<HTMLDivElement>(template));

		this.description = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		this.closeButton.addEventListener('click', () => {
			this.events.emit('success:close');
		});
	}	

	set total(value: number) {
		this.description.textContent = `Списано ${value} синапсов`;
	}
}

