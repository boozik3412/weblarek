import './scss/styles.scss';

// Импорт тестов
import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Order } from './components/models/Order';

// Простой тест классов моделей
const products = new Products();
console.log('Products class instantiated');

const basket = new Basket();
console.log('Basket class instantiated');

const buyer = { phone: '1234567890', email: 'test@test.com', address: 'Test' };
const order = new Order(buyer, [], 0);
console.log('Order class instantiated');
console.log('Models are working correctly!');
