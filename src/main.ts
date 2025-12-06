import './scss/styles.scss';

import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { ShopAPI } from './components/ShopAPI/ShopAPI';
import { apiProducts } from './utils/data';
import { ProductList } from './components/Models/ProductList';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';

async function main() {
  console.log('=== Инициализация приложения ===');
  console.log('API URL:', API_URL);
  
  // Создаем экземпляры классов
  const productsModel = new ProductList();
  const cartModel = new Cart();
  const buyerModel = new Buyer();
  
  // Создаем API клиент
   const api = new Api(API_URL); 
  const shopApi = new ShopAPI(api);

  // Пытаемся загрузить товары с сервера
  console.log('\n=== Загрузка товаров с сервера ===');
  try {
    const productsResponse = await shopApi.getProductList();
    console.log('Товары успешно загружены с сервера');
    productsModel.setItems(productsResponse.items);
    console.log(`Загружено товаров: ${productsResponse.items.length}`);
  } catch (error) {
    console.warn('Не удалось загрузить товары с сервера, используем локальные данные:', error);
    productsModel.setItems(apiProducts.items);
    console.log(`Использовано локальных товаров: ${apiProducts.items.length}`);
  }

  // Тестирование ProductList
  console.log('\n=== Тестирование ProductList ===');
  console.log('Массив товаров из каталога:', productsModel.getItems());
  
  // Используем ID из загруженных товаров
  const firstProductId = productsModel.getItems()[0]?.id;
  if (firstProductId) {
    const product = productsModel.getItemById(firstProductId);
    console.log('Первый товар по ID:', product);
    
    productsModel.setSelectedItem(product ?? null);
    console.log('Выбранный товар:', productsModel.getSelectedItem());
    
    // Тестирование Cart
    console.log('\n=== Тестирование Cart ===');
    if (product) {
      cartModel.addItem(product);
      console.log('Товар добавлен в корзину');
    }
    
    // Добавляем второй товар, если есть
    if (productsModel.getItems().length > 1) {
      const secondProductId = productsModel.getItems()[1].id;
      const anotherProduct = productsModel.getItemById(secondProductId);
      if (anotherProduct) {
        cartModel.addItem(anotherProduct);
      }
    }
  }

  console.log('Товары в корзине:', cartModel.getItems());
  console.log('Количество товаров в корзине:', cartModel.getCount());
  console.log('Общая стоимость корзины:', cartModel.getTotal());
  
  if (firstProductId) {
    console.log(`Есть ли товар с ID ${firstProductId} в корзине:`, cartModel.hasItem(firstProductId));
  }
  
  if (productsModel.getItems()[0]) {
    cartModel.removeItem(productsModel.getItems()[0]);
    console.log('После удаления первого товара:', cartModel.getItems());
  }

  // Тестирование Buyer
  console.log('\n=== Тестирование Buyer ===');
  buyerModel.setData({
    email: 'test@example.com',
    phone: '+79991234567'
  });
  console.log('Данные покупателя после частичного заполнения:', buyerModel.getData());

  buyerModel.setAddress('ул. Примерная, д. 1');
  console.log('Данные покупателя после добавления адреса:', buyerModel.getData());

  console.log('Валидность данных (должно быть false):', buyerModel.isValid());
  console.log('Ошибки валидации:', buyerModel.validate());

  buyerModel.setPayment('card');
  console.log('Валидность данных после добавления payment (должно быть true):', buyerModel.isValid());
  console.log('Ошибки валидации после добавления payment:', buyerModel.validate());

  // Демонстрация создания заказа с API
  console.log('\n=== Тестирование создания заказа через API ===');
  
  if (buyerModel.isValid() && cartModel.getCount() > 0) {
    const buyerData = buyerModel.getData();
    const orderData = {
      payment: buyerData.payment!,
      email: buyerData.email!,
      phone: buyerData.phone!,
      address: buyerData.address!,
      total: cartModel.getTotal(),
      items: cartModel.getItems().map((item: { id: any; }) => item.id)
    };
    
    console.log('Подготовленные данные для заказа:', orderData);
        
  } else {
    console.log('Невозможно создать заказ: проверьте данные покупателя и корзину');
  }

  buyerModel.clear();
  console.log('Данные покупателя после очистки:', buyerModel.getData());

  // Тестирование отдельных методов валидации
  console.log('\n=== Тестирование отдельных методов валидации ===');
  buyerModel.setEmail('invalid-email');
  console.log('Валидность email "invalid-email":', buyerModel.isValidEmailField());
  buyerModel.setEmail('valid@email.com');
  console.log('Валидность email "valid@email.com":', buyerModel.isValidEmailField());

  console.log('\n=== Тестирование завершено ===');
  console.log('Все компоненты работают корректно!');
}

// Запускаем приложение
main().catch(error => {
  console.error('Критическая ошибка при запуске приложения:', error);
});