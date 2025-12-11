import './scss/styles.scss';

import { API_URL } from './utils/constants';
import { ensureElement } from './utils/utils';

import { Api } from './components/base/Api';
import { ShopAPI } from './components/ShopAPI/ShopAPI';

import { EventEmitter } from './components/base/Events';

import { ProductList } from './components/Models/ProductList';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';

import { Header } from './components/View/Header';
import { Catalog } from './components/View/Catalog';
import { Modal } from './components/View/Modal';
import { CatalogCard } from './components/View/CatalogCard';
import { PreviewCard } from './components/View/PreviewCard';
import { Basket } from './components/View/Basket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';

import type { IProduct, IOrderRequest, IValidationResult } from './types';

async function main() {
	// ==== Брокер событий ====
	const events = new EventEmitter();

	// ==== Модели ====
	const productsModel = new ProductList(events);
	const cartModel = new Cart(events);
	const buyerModel = new Buyer();

	// ==== API ====
	const api = new Api(API_URL);
	const shopApi = new ShopAPI(api);

	// ==== View ====

	// Хедер
	const header = new Header(events, document.body);

	// Каталог
	const catalogContainer = ensureElement<HTMLElement>('.gallery', document.body);
	const catalog = new Catalog(catalogContainer);

	// Модалка
	const modalContainer = ensureElement<HTMLElement>('#modal-container', document.body);
	const modal = new Modal(events, modalContainer);

	// Шаблоны
	const tplCatalogCard = ensureElement<HTMLTemplateElement>('#card-catalog');
	const tplPreviewCard = ensureElement<HTMLTemplateElement>('#card-preview');
	const tplBasket = ensureElement<HTMLTemplateElement>('#basket');
	const tplBasketItem = ensureElement<HTMLTemplateElement>('#card-basket');
	const tplOrder = ensureElement<HTMLTemplateElement>('#order');
	const tplContacts = ensureElement<HTMLTemplateElement>('#contacts');
	const tplSuccess = ensureElement<HTMLTemplateElement>('#success');

	// Корзина (view)
	const basketView = new Basket(events, tplBasket, tplBasketItem);

	// Текущие формы (если открыты)
	let orderFormView: OrderForm | null = null;
	let contactsFormView: ContactsForm | null = null;

	// ====== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ПРЕЗЕНТЕРА ======

	// Построить карточки каталога по данным модели
	function renderCatalog() {
	const items = productsModel.getItems();

	const nodes = items.map((product: IProduct) => {
		const card = new CatalogCard(events, tplCatalogCard);

		return card.render({
			id: product.id,
			title: product.title,
			price: product.price,
			image: product.image,
			category: product.category, 
		});
	});

	catalog.render({ items: nodes });
}

	// Обновить header + корзину
	function renderBasket() {
		header.render({ counter: cartModel.getCount() });

		basketView.render({
			items: cartModel.getItems(),
			total: cartModel.getTotal(),
		});
	}

	// Состояние формы заказа 
	function getOrderFormState(): {
		payment?: string;
		address?: string;
		valid: boolean;
		errors: string;
	} {
		const data = buyerModel.getData();
		const hasPayment = !!data.payment;
		const hasAddress = !!data.address;

		// Стартовое состояние — ничего не выбрано и не введено:	
		if (!hasPayment && !hasAddress) {
			return {
				payment: data.payment,
				address: data.address,
				valid: false,
				errors: '',
			};
		}

		// Если что-то уже заполнили — включаем валидацию
		const errors: IValidationResult = buyerModel.validate();

		const paymentError = errors.payment;
		const addressError = errors.address;

		const valid = hasPayment && hasAddress && !paymentError && !addressError;
		const errorText = paymentError || addressError || '';

		return {
			payment: data.payment,
			address: data.address,
			valid,
			errors: errorText,
		};
	}

	// Состояние формы контактов
	function getContactsFormState(): {
		email?: string;
		phone?: string;
		valid: boolean;
		errors: string;
	} {
		const data = buyerModel.getData();
		const hasEmail = !!data.email;
		const hasPhone = !!data.phone;

		// Стартовое состояние — поля пустые, кнопка неактивна, ошибок нет
		if (!hasEmail && !hasPhone) {
			return {
				email: data.email,
				phone: data.phone,
				valid: false,
				errors: '',
			};
		}

		const errors: IValidationResult = buyerModel.validate();

		const emailError = errors.email;
		const phoneError = errors.phone;

		const valid = hasEmail && hasPhone && !emailError && !phoneError;
		const errorText = emailError || phoneError || '';

		return {
			email: data.email,
			phone: data.phone,
			valid,
			errors: errorText,
		};
	}

	function openOrderForm() {
		orderFormView = new OrderForm(events, tplOrder);
		const state = getOrderFormState();
		const node = orderFormView.render(state);
		modal.open(node);
	}

	function openContactsForm() {
		contactsFormView = new ContactsForm(events, tplContacts);
		const state = getContactsFormState();
		const node = contactsFormView.render(state);
		modal.open(node);
	}

	function openProductPreview() {
		const product = productsModel.getSelectedItem();
		if (!product) return;

		const inBasket = cartModel.hasItem(product.id);
		const preview = new PreviewCard(events, tplPreviewCard);

		const node = preview.render({
			id: product.id,
			title: product.title,
			price: product.price,
			image: product.image,
			category: product.category,
			description: product.description,
			inBasket,
		});

		modal.open(node);
	}

	function openBasketModal() {
		const node = basketView.render({
			items: cartModel.getItems(),
			total: cartModel.getTotal(),
		});
		modal.open(node);
	}

	function openSuccessModal(total: number) {
		const successView = new Success(events, tplSuccess);
		const node = successView.render({ total });
		modal.open(node);
	}

	// ====== СОБЫТИЯ МОДЕЛЕЙ ======

	events.on('catalog:changed', () => {
		renderCatalog();
	});

	events.on('product:selected', () => {
		openProductPreview();
	});

	events.on('cart:changed', () => {
		renderBasket();
	});

	// ====== СОБЫТИЯ VIEW-КОМПОНЕНТОВ ======

	events.on('basket:open', () => {
		openBasketModal();
	});

	events.on('card:select', ({ id }: { id: string }) => {
		const product = productsModel.getItemById(id);
		productsModel.setSelectedItem(product ?? null);
	});

	events.on('preview:toggle', ({ id }: { id: string }) => {
		const product = productsModel.getItemById(id);
		if (!product) return;

		if (cartModel.hasItem(id)) {
			cartModel.removeItem(product);
		} else {
			cartModel.addItem(product);
		}
		modal.close();
	});

	events.on('basket:remove', ({ id }: { id: string }) => {
		const product = productsModel.getItemById(id);
		if (!product) return;
		cartModel.removeItem(product);
	});

	events.on('basket:order', () => {
		openOrderForm();
	});

	events.on('order:change', (data: { payment?: string; address?: string }) => {
		if (data.payment !== undefined) {
			buyerModel.setPayment(data.payment);
		}
		if (data.address !== undefined) {
			buyerModel.setAddress(data.address);
		}

		if (orderFormView) {
			orderFormView.render(getOrderFormState());
		}
	});

	events.on('order:submit', () => {
		const state = getOrderFormState();
		if (!state.valid) return;
		openContactsForm();
	});

	events.on('contacts:change', (data: { email?: string; phone?: string }) => {
		if (data.email !== undefined) {
			buyerModel.setEmail(data.email);
		}
		if (data.phone !== undefined) {
			buyerModel.setPhone(data.phone);
		}

		if (contactsFormView) {
			contactsFormView.render(getContactsFormState());
		}
	});

	events.on('contacts:submit', async () => {
		if (!buyerModel.isValid()) return;
		if (!cartModel.getCount()) return;

		const buyerData = buyerModel.getData();

		const order: IOrderRequest = {
			payment: buyerData.payment!,
			email: buyerData.email!,
			phone: buyerData.phone!,
			address: buyerData.address!,
			total: cartModel.getTotal(),
			items: cartModel.getItems().map((item: IProduct) => item.id),
		};

		try {
			const response = await shopApi.createOrder(order);

			cartModel.clear();
			buyerModel.clear();

			openSuccessModal(response.total);
		} catch (error) {
			console.error('Ошибка при создании заказа', error);
		}
	});

	events.on('success:close', () => {
		modal.close();
	});

	events.on('modal:close', () => {
		orderFormView = null;
		contactsFormView = null;
	});

	// ====== ПЕРВИЧНАЯ ЗАГРУЗКА ТОВАРОВ ======
	try {
		const productsResponse = await shopApi.getProductList();
		productsModel.setItems(productsResponse.items);
	} catch (error) {
		console.error('Не удалось загрузить товары:', error);
		productsModel.setItems([]);
	}
}

main().catch((error) => {
	console.error('Критическая ошибка при запуске приложения:', error);
});
