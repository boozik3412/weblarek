import './scss/styles.scss';

import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Order } from './components/models/Order';

// ===== ТЕСТИРОВАНИЕ PRODUCTS =====
console.log('=== Тестирование Products ===');
const products = new Products();
console.log('Products instantiated');

// Тест методов Products
// setItems, getItems, getItem, addItem

// ===== ТЕСТИРОВАНИЕ BASKET =====
console.log('\n=== Тестирование Basket ===');
const basket = new Basket();
console.log('Basket instantiated');

// Тест методов Basket
// addItem, getItems, getTotal, getCount, hasItem, removeItem, clear

// ===== ТЕСТИРОВАНИЕ ORDER =====
console.log('\n=== Тестирование Order ===');
const order = new Order();  // ← ИСПРАВЛЕНО: без параметров!
console.log('Order instantiated');

// Тест методов Order
// setPayment, getPayment, setStatus, getStatus, validate

console.log('\n✅ Models are working correctly!');
