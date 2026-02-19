import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { LarekAPI } from './components/LarekAPI';
import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Order } from './components/models/Order';

import { Page } from './components/views/Page';
import { Modal } from './components/views/Modal';
import { CardCatalog, CardPreview, CardBasket } from './components/views/Card';
import { BasketView } from './components/views/BasketView';
import { OrderForm, ContactsForm } from './components/views/Form';
import { Success } from './components/views/Success';

import { API_URL, CDN_URL } from './utils/constants';
import { IProduct } from './types';

// ---- Инициализация ----
const events = new EventEmitter();
const baseApi = new Api(API_URL);
const api = new LarekAPI(baseApi);

// Модели данных
const productsModel = new Products(events);
const basketModel = new Basket(events);
const orderModel = new Order(events);

// ---- View: страница ----
const page = new Page(document.body, events);

// ---- View: модальное окно ----
const modalContainer = document.getElementById('modal-container') as HTMLElement;
const modal = new Modal(modalContainer, events);

// ---- View: корзина (из шаблона) ----
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const basketEl = basketTemplate.content.querySelector('.basket').cloneNode(true) as HTMLElement;
const basketView = new BasketView(basketEl, events);

// ---- View: форма заказа шаг 1 (из шаблона) ----
const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
const orderFormEl = orderTemplate.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
const orderForm = new OrderForm(orderFormEl, events);

// ---- View: форма контактов шаг 2 (из шаблона) ----
const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
const contactsFormEl = contactsTemplate.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
const contactsForm = new ContactsForm(contactsFormEl, events);

// ---- View: экран успеха (из шаблона) ----
const successTemplate = document.getElementById('success') as HTMLTemplateElement;
const successEl = successTemplate.content.querySelector('.order-success').cloneNode(true) as HTMLElement;
const successView = new Success(successEl, events);

// ==============================
// ОБРАБОТЧИКИ СОБЫТИЙ (Презентер)
// ==============================

// Каталог загружен — рендерим карточки на странице
events.on('catalog:changed', ({ items }: { items: IProduct[] }) => {
    const cardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
    const cards = items.map((product) => {
        const cardEl = cardTemplate.content.querySelector('.card').cloneNode(true) as HTMLElement;
        const card = new CardCatalog(cardEl, () => {
            events.emit('card:select', { product });
        });
        return card.render({
            title: product.title,
            price: product.price,
            category: product.category,
            image: CDN_URL + product.image,
        });
    });
    page.render({ catalog: cards });
});

// Клик по карточке каталога — сохранить превью в модели
events.on('card:select', ({ product }: { product: IProduct }) => {
    productsModel.setPreview(product);
});

// Превью изменилось — открыть модалку с карточкой превью
events.on('preview:changed', ({ product }: { product: IProduct }) => {
    const previewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
    const previewEl = previewTemplate.content.querySelector('.card').cloneNode(true) as HTMLElement;
    const card = new CardPreview(previewEl, events);

    const inBasket = basketModel.hasItem(product.id);
    const hasPrice = product.price !== null;

    card.setButtonState(inBasket, hasPrice);
    card.setOnButtonClick(() => {
        if (basketModel.hasItem(product.id)) {
            basketModel.removeItem(product.id);
        } else {
            basketModel.addItem(product);
        }
        modal.close();
    });

    modal.render({
        content: card.render({
            title: product.title,
            price: product.price,
            category: product.category,
            image: CDN_URL + product.image,
            description: product.description,
        }),
    });
});

// Корзина изменилась — обновить счётчик в хедере
events.on('basket:changed', ({ items }: { items: IProduct[] }) => {
    page.render({ counter: items.length });
});

// Открыть корзину
events.on('basket:open', () => {
    const cardTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
    const basketItems = basketModel.getItems().map((product, index) => {
        const cardEl = cardTemplate.content.querySelector('.card').cloneNode(true) as HTMLElement;
        const card = new CardBasket(cardEl, () => {
            basketModel.removeItem(product.id);
            events.emit('basket:open');
        });
        return card.render({
            title: product.title,
            price: product.price,
            index: index + 1,
        });
    });

    modal.render({
        content: basketView.render({
            items: basketItems,
            total: basketModel.getTotal(),
        }),
    });
});

// Блокировка прокрутки страницы при открытии модалки
events.on('modal:open', () => {
    page.render({ locked: true });
});

// Разблокировка при закрытии модалки
events.on('modal:close', () => {
    page.render({ locked: false });
});

// Нажата кнопка "Оформить" в корзине — открыть форму заказа
events.on('order:start', () => {
    orderForm.render({ valid: false, errors: '' });
    modal.render({ content: orderForm.container });
});

// Изменение поля в форме заказа (адрес, способ оплаты)
events.on('order:change', ({ field, value }: { field: string; value: string }) => {
    if (field === 'paymentMethod') {
        orderModel.setPayment(value);
    } else {
        orderModel.setField(field as any, value);
    }
    const errors = orderModel.validate();
    const isValid = !errors.address && !errors.paymentMethod;
    orderForm.render({
        valid: isValid,
        errors: Object.values(errors).filter(Boolean)[0] ?? '',
    });
});

// Сабмит формы заказа — переход ко второй форме
events.on('order:submit', () => {
    contactsForm.render({ valid: false, errors: '' });
    modal.render({ content: contactsForm.container });
});

// Изменение поля в форме контактов (email, телефон)
events.on('contacts:change', ({ field, value }: { field: string; value: string }) => {
    orderModel.setField(field as any, value);
    const errors = orderModel.validate();
    const isValid = !errors.email && !errors.phone;
    contactsForm.render({
        valid: isValid,
        errors: Object.values(errors).filter(Boolean)[0] ?? '',
    });
});

// Сабмит формы контактов — отправка заказа на сервер
events.on('contacts:submit', () => {
    const items = basketModel.getItems();
    orderModel.items = items.map((p) => p.id);
    orderModel.total = basketModel.getTotal();

    api.postOrder(orderModel)
        .then((result) => {
            const total = result.total ?? orderModel.total;
            modal.render({
                content: successView.render({ total }),
            });
            basketModel.clear();
            orderModel.clear();
        })
        .catch(console.error);
});

// Закрытие экрана успешного заказа
events.on('success:close', () => {
    modal.close();
});

// ---- Загрузка товаров с сервера ----
api.getProducts()
    .then((items) => {
        productsModel.setItems(items);
    })
    .catch(console.error);
