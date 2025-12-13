import { cloneTemplate, ensureElement } from '../../utils/utils';
import type { IEvents } from '../base/Events';
import { Card, ICardState } from './Card';

interface IBasketItemState extends ICardState {
  id: string;
  index: number;
}

export class BasketItem extends Card<IBasketItemState> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    template: HTMLTemplateElement
  ) {
    const container = cloneTemplate<HTMLLIElement>(template);
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      '.basket__item-index',
      this.container
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      '.basket__item-delete',
      this.container
    );

    this.deleteButton.addEventListener('click', (event) => {
      event.stopPropagation();

      const id = this.container.dataset.id;
      if (id) {
        this.events.emit('basket:remove', { id });
      }
    });
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}




