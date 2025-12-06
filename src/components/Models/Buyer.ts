import { IBuyer, IValidationResult, TPayment } from '../../types';

export class Buyer {
  private data: Partial<IBuyer> = {};

  // Сохранение данных (общий метод для всех полей)
  setData(data: Partial<IBuyer>): void {
    this.data = { ...this.data, ...data };
  }

  // Сохранение отдельного поля
  setPayment(payment: TPayment): void {
    this.data.payment = payment;
  }

  setEmail(email: string): void {
    this.data.email = email;
  }

  setPhone(phone: string): void {
    this.data.phone = phone;
  }

  setAddress(address: string): void {
    this.data.address = address;
  }

  // Получение всех данных покупателя
  getData(): Partial<IBuyer> {
    return { ...this.data };
  }

  // Очистка данных покупателя
  clear(): void {
    this.data = {};
  }

  // Валидация данных
  validate(): IValidationResult {
    const errors: IValidationResult = {};

    if (!this.data.payment || this.data.payment.trim() === '') {
      errors.payment = 'Не выбран вид оплаты';
    }

    if (!this.data.email || this.data.email.trim() === '') {
      errors.email = 'Укажите емэйл';
    } else if (!this.isValidEmail(this.data.email)) {
      errors.email = 'Укажите корректный емэйл';
    }

    if (!this.data.phone || this.data.phone.trim() === '') {
      errors.phone = 'Укажите телефон';
    }

    if (!this.data.address || this.data.address.trim() === '') {
      errors.address = 'Укажите адрес';
    }

    return errors;
  }

  // Проверка валидности email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Проверка валидности отдельного поля
  isValidPayment(): boolean {
    return !!(this.data.payment && this.data.payment.trim() !== '');
  }

  isValidEmailField(): boolean {
    return !!(this.data.email && 
              this.data.email.trim() !== '' && 
              this.isValidEmail(this.data.email));
  }

  isValidPhone(): boolean {
    return !!(this.data.phone && this.data.phone.trim() !== '');
  }

  isValidAddress(): boolean {
    return !!(this.data.address && this.data.address.trim() !== '');
  }

  // Общая проверка всех полей
  isValid(): boolean {
    const errors = this.validate();
    return Object.keys(errors).length === 0;
  }
}