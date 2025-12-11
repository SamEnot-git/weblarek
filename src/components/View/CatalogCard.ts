import { cloneTemplate, ensureElement } from '../../utils/utils';
import type { IEvents } from '../base/Events';
import { Card, ICardState } from './Card';
import { categoryMap, CDN_URL } from '../../utils/constants';

interface ICatalogCardState extends ICardState {
	id: string;
	image: string;
	category: keyof typeof categoryMap;
}

export class CatalogCard extends Card<ICatalogCardState> {
	protected imageElement: HTMLImageElement;
	protected categoryElement: HTMLElement;
	
	private _id: string | null = null;

	constructor(
		protected events: IEvents,
		template: HTMLTemplateElement
	) {
		const container = cloneTemplate<HTMLButtonElement>(template);
		super(container);

		this.imageElement = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);
		this.categoryElement = ensureElement<HTMLElement>(
			'.card__category',
			this.container
		);
		
		this.container.addEventListener('click', () => {
			if (this._id) {
				this.events.emit('card:select', { id: this._id });
			}
		});
	}

	set id(value: string) {
		this._id = value;
	}

	set image(value: string) {
		const src = `${CDN_URL}/${value}`;
		this.setImage(this.imageElement, src, this.titleElement.textContent || '');
	}

	set category(value: keyof typeof categoryMap) {
		this.categoryElement.textContent = value;
		this.categoryElement.className = 'card__category';

		const modifier = categoryMap[value];
		if (modifier) {
			this.categoryElement.classList.add(modifier);
		}
	}
}


