import { Component } from '../base/Component';
import { categoryMap, CDN_URL } from '../../utils/constants';
import type { IProduct } from '../../types/index';

interface ICard {
	product: IProduct;
	inBasket?: boolean;
	disabled?: boolean;
}

export abstract class Card extends Component<ICard> {
	protected title: HTMLElement;
	protected image: HTMLImageElement | null;
	protected category: HTMLElement | null;
	protected price: HTMLElement;
	protected button: HTMLButtonElement | null;

	protected currentProduct: IProduct | null = null;

	constructor(container: HTMLElement) {
		super(container);

		this.title = this.container.querySelector('.card__title') as HTMLElement;
		this.image = this.container.querySelector('.card__image') as HTMLImageElement | null;
		this.category = this.container.querySelector('.card__category') as HTMLElement | null;
		this.price = this.container.querySelector('.card__price') as HTMLElement;
		this.button = this.container.querySelector('.card__button') as HTMLButtonElement | null;
	}

	protected setProduct(data: ICard) {
		const { product, inBasket, disabled } = data;
		this.currentProduct = product;
	
		this.title.textContent = product.title;
		
		if (this.image) {
			this.image.src = `${CDN_URL}/${product.image}`;
			this.image.alt = product.title;
		}
	
		if (product.price === null) {
			this.price.textContent = 'Бесценно';
		} else {
			this.price.textContent = `${product.price} синапсов`;
		}
		
		if (this.category) {
			this.category.className = 'card__category';
			const modifier = categoryMap[product.category as keyof typeof categoryMap];
			if (modifier) {
				this.category.classList.add(modifier);
			}
			this.category.textContent = product.category;
		}

		if (this.button) {
			if (product.price === null) {
				this.button.disabled = true;
				this.button.textContent = 'Недоступно';
			} else if (disabled) {
				this.button.disabled = true;
			} else if (inBasket) {
				this.button.disabled = false;
				this.button.textContent = 'Удалить из корзины';
			} else {
				this.button.disabled = false;
				this.button.textContent = 'Купить';
			}
		}
	}

	render(data: ICard): HTMLElement {
		this.setProduct(data);
		return this.container;
	}
}