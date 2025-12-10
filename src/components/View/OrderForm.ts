import { cloneTemplate, ensureElement } from '../../utils/utils';
import type { IEvents } from '../base/Events';
import { Form } from './Form';
import type { TPayment } from '../../types';

interface IOrderForm {
	payment?: TPayment;
	address?: string;
	valid: boolean;
	errors: string;
}

export class OrderForm extends Form<IOrderForm> {
	protected buttons: NodeListOf<HTMLButtonElement>;
	protected addressInput: HTMLInputElement;

	constructor(
		protected events: IEvents,
		template: HTMLTemplateElement
	) {
		const formElement = cloneTemplate<HTMLFormElement>(template);
		super(events, formElement);

		this.buttons = this.form.querySelectorAll<HTMLButtonElement>(
			'.order__buttons .button'
		);
		this.addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			this.form
		);

		// выбор способа оплаты
		this.buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this.buttons.forEach((b) =>
					b.classList.remove('button_alt-active')
				);
				button.classList.add('button_alt-active');

				const payment = button.name as TPayment;
				this.events.emit('order:change', {
					payment,
					address: this.addressInput.value,
				});
			});
		});

		// ввод адреса
		this.form.addEventListener('input', () => {
			this.events.emit('order:change', {
				payment: this.getPayment(),
				address: this.addressInput.value,
			});
		});

		// отправка формы 
		this.form.addEventListener('submit', (event) => {
			event.preventDefault();
			this.events.emit('order:submit', {
				payment: this.getPayment(),
				address: this.addressInput.value,
			});
		});
	}

	protected getPayment(): TPayment | undefined {
		const active = Array.from(this.buttons).find((b) =>
			b.classList.contains('button_alt-active')
		);
		return active?.name as TPayment | undefined;
	}

	render(data: IOrderForm): HTMLElement {
		super.render(data);

		if (data.address !== undefined) {
			this.addressInput.value = data.address;
		}

		this.buttons.forEach((button) => {
			button.classList.toggle(
				'button_alt-active',
				data.payment !== undefined && button.name === data.payment
			);
		});

		return this.container;
	}
}
