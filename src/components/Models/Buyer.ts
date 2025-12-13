import type { IBuyer, IValidationResult, TPayment } from '../../types';
import type { IEvents } from '../base/Events';

export class Buyer {
  private data: Partial<IBuyer> = {};

  constructor(private events: IEvents) {}
 
  setData(data: Partial<IBuyer>): void {
    this.data = { ...this.data, ...data };
    this.events.emit('buyer:change', this.getData());
  }
  
  setPayment(payment: TPayment): void {
    this.data.payment = payment;
    this.events.emit('buyer:change', this.getData());
  }

  setEmail(email: string): void {
    this.data.email = email;
    this.events.emit('buyer:change', this.getData());
  }

  setPhone(phone: string): void {
    this.data.phone = phone;
    this.events.emit('buyer:change', this.getData());
  }

  setAddress(address: string): void {
    this.data.address = address;
    this.events.emit('buyer:change', this.getData());
  }
  
  getData(): Partial<IBuyer> {
    return { ...this.data };
  }
 
  clear(): void {
    this.data = {};
    this.events.emit('buyer:change', this.getData());
  }
  
  validate(): IValidationResult {
    const errors: IValidationResult = {};

    if (!this.data.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }
    if (!this.data.email) {
      errors.email = 'Укажите email';
    }
    if (!this.data.phone) {
      errors.phone = 'Укажите телефон';
    }
    if (!this.data.address) {
      errors.address = 'Укажите адрес доставки';
    }

    return errors;
  }
  
  isValid(): boolean {
    return Object.keys(this.validate()).length === 0;
  }
}
