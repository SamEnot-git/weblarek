import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Card, ICardState } from './Card';
import { CDN_URL, categoryMap } from '../../utils/constants';

interface IPreviewCardState extends ICardState {
  id: string;
  image: string;
  category: keyof typeof categoryMap;
  description: string;
  inBasket: boolean;
  price: number | null;
}

export class PreviewCard extends Card<IPreviewCardState> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(
    template: HTMLTemplateElement,
    onToggle: (id: string) => void
  ) {
    const container = cloneTemplate<HTMLDivElement>(template);
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.buttonElement.addEventListener('click', (event) => {
      event.stopPropagation();

      const id = this.container.dataset.id;
      const available = this.container.dataset.available === '1';

      if (!id) return;
      if (!available) return;

      onToggle(id);
    });
  }

  // =============== СЕТТЕРЫ  =================

  set id(value: string) {
    this.container.dataset.id = value;
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

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }
  set price(value: number | null) {
    this.container.dataset.available = value === null ? '0' : '1';
    super.price = value;
  }

  set inBasket(value: boolean) {
    const available = this.container.dataset.available === '1';

    if (!available) {
      this.buttonElement.textContent = 'Недоступно';
      this.buttonElement.disabled = true;
      return;
    }

    this.buttonElement.disabled = false;
    this.buttonElement.textContent = value ? 'Удалить из корзины' : 'В корзину';
  }
}


