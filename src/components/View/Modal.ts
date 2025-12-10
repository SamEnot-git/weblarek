import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import type { IEvents } from '../base/Events';

interface IModal {
	content: HTMLElement | null;
}

export class Modal extends Component<IModal> {
	protected content: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(protected events: IEvents, container: HTMLElement) {
		super(container);

		this.content = ensureElement<HTMLElement>('.modal__content', this.container);
		this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

		this.closeButton.addEventListener('click', () => {
			this.close();
			this.events.emit('modal:close');
		});

		this.container.addEventListener('click', (event) => {
			if (event.target === this.container) {
				this.close();
				this.events.emit('modal:close');
			}
		});
	}

	open(content: HTMLElement) {
		this.render({ content });
		this.container.classList.add('modal_active');
	}

	close() {
		this.container.classList.remove('modal_active');
	}

	render(data?: IModal): HTMLElement {
		if (data?.content) {
			this.content.replaceChildren(data.content);
		}
		return this.container;
	}
}
