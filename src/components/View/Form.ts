import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import type { IEvents } from '../base/Events';

export interface IFormState {
	valid: boolean;
	errors: string;
}

export abstract class Form<T extends IFormState> extends Component<T> {
	protected form: HTMLFormElement;
	protected submitButton: HTMLButtonElement;
	protected errorsElement: HTMLElement;

	constructor(
		protected events: IEvents,
		container: HTMLFormElement,
	) {
		super(container);

		this.form = container;

		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			this.form
		);

		 this.errorsElement = ensureElement<HTMLElement>(
			'.form__errors',
			this.form
		);
	}

	set valid(value: boolean) {
		this.submitButton.disabled = !value;
	}

	set errors(value: string) {
		this.errorsElement.textContent = value;
	}
}

