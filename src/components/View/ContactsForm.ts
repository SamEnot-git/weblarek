import { cloneTemplate, ensureElement } from '../../utils/utils';
import type { IEvents } from '../base/Events';
import { Form } from './Form';

interface IContactsForm {
	email?: string;
	phone?: string;
	valid: boolean;
	errors: string;
}

export class ContactsForm extends Form<IContactsForm> {
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;

	constructor(
		protected events: IEvents,
		template: HTMLTemplateElement
	) {	
		const formElement = cloneTemplate<HTMLFormElement>(template);
		super(events, formElement);

		this.emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			this.form
		);
		this.phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			this.form
		);

		// изменение полей формы
		this.form.addEventListener('input', () => {
			this.events.emit('contacts:change', {
				email: this.emailInput.value,
				phone: this.phoneInput.value,
			});
		});

		// отправка формы — финальная оплата
		this.form.addEventListener('submit', (event) => {
			event.preventDefault();
			this.events.emit('contacts:submit', {
				email: this.emailInput.value,
				phone: this.phoneInput.value,
			});
		});
	}

	render(data: IContactsForm): HTMLElement {
		super.render(data);

		if (data.email !== undefined) {
			this.emailInput.value = data.email;
		}
		if (data.phone !== undefined) {
			this.phoneInput.value = data.phone;
		}

		return this.container;
	}
}
