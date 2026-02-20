import "./scss/styles.scss";
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { LarekAPI } from "./components/LarekAPI";
import { Products } from "./components/models/Products";
import { Basket } from "./components/models/Basket";
import { Order } from "./components/models/Order";
import { Page } from "./components/views/Page";
import { Modal } from "./components/views/Modal";
import { CardCatalog, CardPreview, CardBasket } from "./components/views/Card";
import { BasketView } from "./components/views/BasketView";
import { OrderForm, ContactsForm } from "./components/views/Form";
import { Success } from "./components/views/Success";
import { API_URL, CDN_URL } from "./utils/constants";
import { IProduct, IOrder, ICardBasket } from "./types";

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
const modalContainer = document.getElementById("modal-container") as HTMLElement;
const modal = new Modal(modalContainer, events);

// ---- View: корзина (из шаблона) ----
const basketTemplate = document.getElementById("basket") as HTMLTemplateElement;
const basketEl = basketTemplate.content
    .querySelector(".basket")!
    .cloneNode(true) as HTMLElement;
const basketView = new BasketView(basketEl, events);

// ---- View: форма заказа шаг 1 (из шаблона) ----
const orderTemplate = document.getElementById("order") as HTMLTemplateElement;
const orderFormEl = orderTemplate.content
    .querySelector(".form")!
    .cloneNode(true) as HTMLFormElement;
const orderForm = new OrderForm(orderFormEl, events);

// ---- View: форма контактов шаг 2 (из шаблона) ----
const contactsTemplate = document.getElementById("contacts") as HTMLTemplateElement;
const contactsFormEl = contactsTemplate.content
    .querySelector(".form")!
    .cloneNode(true) as HTMLFormElement;
const contactsForm = new ContactsForm(contactsFormEl, events);

// ---- View: экран успеха (из шаблона) ----
const successTemplate = document.getElementById("success") as HTMLTemplateElement;
const successEl = successTemplate.content
    .querySelector(".order-success")!
    .cloneNode(true) as HTMLElement;
const successView = new Success(successEl, events);

// ---- View: карточка превью (один экземпляр) ----
const previewTemplate = document.getElementById("card-preview") as HTMLTemplateElement;
const previewEl = previewTemplate.content
    .querySelector(".card")!
    .cloneNode(true) as HTMLElement;
const cardPreview = new CardPreview(previewEl, events);

// ==============================
// ОБРАБОТЧИКИ СОБЫТИЙ (Презентер)
// ==============================

// Каталог загружен — рендерим карточки на странице
events.on("catalog:changed", ({ items }: { items: IProduct[] }) => {
    const cardTemplate = document.getElementById("card-catalog") as HTMLTemplateElement;
    const cards = items.map((product) => {
        const cardEl = cardTemplate.content
            .querySelector(".card")!
            .cloneNode(true) as HTMLElement;
        const card = new CardCatalog(cardEl, () => {
            events.emit("card:select", product);
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
events.on("card:select", (product: IProduct) => {
    productsModel.setPreview(product);
});

// Превью изменилось — обновить контент карточки и открыть модалку
events.on("preview:changed", ({ product }: { product: IProduct }) => {
    const inBasket = basketModel.hasItem(product.id);
    const hasPrice = product.price !== null;
    cardPreview.setButtonState(inBasket, hasPrice);
    cardPreview.render({
        title: product.title,
        price: product.price,
        category: product.category,
        image: CDN_URL + product.image,
        description: product.description,
    });
    modal.render({ content: cardPreview.container });
});

// Клик по кнопке в превью — добавить/удалить из корзины
events.on("product:toggle", () => {
    const product = productsModel.getSelectedProduct();
    if (!product) return;
    if (basketModel.hasItem(product.id)) {
        basketModel.removeItem(product.id);
    } else {
        basketModel.addItem(product);
    }
    modal.close();
});

// Обновить представление корзины (список и итог)
function updateBasketView(): void {
    const items = basketModel.getItems();
    const cardTemplate = document.getElementById("card-basket") as HTMLTemplateElement;
    const basketItems = items.map((product, index) => {
        const cardEl = cardTemplate.content
            .querySelector(".card")!
            .cloneNode(true) as HTMLElement;
        const card = new CardBasket(cardEl, () => {
            basketModel.removeItem(product.id);
        });
        return card.render({
            title: product.title,
            price: product.price,
            index: index + 1,
        } as ICardBasket);
    });
    basketView.items = basketItems;
    basketView.total = basketModel.getTotal();
}

// Корзина изменилась — обновить счётчик и список в представлении
events.on("basket:changed", ({ items }: { items: IProduct[] }) => {
    page.render({ counter: items.length });
    updateBasketView();
});

// Открыть корзину — только открыть модалку с текущим содержимым
events.on("basket:open", () => {
    updateBasketView();
    modal.render({ content: basketView.container });
});

// Блокировка прокрутки страницы при открытии модалки
events.on("modal:open", () => {
    page.render({ locked: true });
});

// Разблокировка при закрытии модалки
events.on("modal:close", () => {
    page.render({ locked: false });
});

// Изменение поля в форме заказа — только обновить модель
events.on(
    "order:change",
    ({ field, value }: { field: "address" | "paymentMethod"; value: string }) => {
        if (field === "paymentMethod") {
            orderModel.setPayment(value as "card" | "cash");
        } else {
            orderModel.setField(field, value);
        }
    }
);

// Обновить представление форм из модели заказа
function updateOrderFormsFromModel(): void {
    const errors = orderModel.validate();
    const isValidStepOne = !errors.address && !errors.paymentMethod;
    const stepOneError = errors.address ?? errors.paymentMethod ?? "";
    orderForm.payment = orderModel.getPayment();
    orderForm.address = orderModel.address;
    orderForm.valid = isValidStepOne;
    orderForm.errors = stepOneError;

    const isValidStepTwo = !errors.email && !errors.phone;
    const stepTwoError = errors.email ?? errors.phone ?? "";
    contactsForm.email = orderModel.email;
    contactsForm.phone = orderModel.phone;
    contactsForm.valid = isValidStepTwo;
    contactsForm.errors = stepTwoError;
}

// Модель заказа изменилась — обновить представление форм
events.on("order:changed", () => {
    updateOrderFormsFromModel();
});

// Нажата кнопка "Оформить" в корзине — открыть форму заказа
events.on("order:start", () => {
    modal.render({ content: orderForm.container });
    updateOrderFormsFromModel();
});

// Сабмит формы заказа — переход ко второй форме
events.on("order:submit", () => {
    modal.render({ content: contactsForm.container });
    updateOrderFormsFromModel();
});

// Изменение поля в форме контактов — только обновить модель
events.on(
    "contacts:change",
    ({ field, value }: { field: "email" | "phone"; value: string }) => {
        orderModel.setField(field, value);
    }
);

// Сабмит формы контактов — собрать объект заказа и отправить на сервер
events.on("contacts:submit", () => {
    const items = basketModel.getItems();
    const payload: IOrder = {
        payment: orderModel.getPayment() || undefined,
        email: orderModel.email,
        phone: orderModel.phone,
        address: orderModel.address,
        items: items.map((p) => p.id),
        total: basketModel.getTotal(),
    };

    api
        .postOrder(payload)
        .then((result) => {
            const total = result.total ?? basketModel.getTotal();
            modal.render({
                content: successView.render({ total }),
            });
            basketModel.clear();
            orderModel.clear();
        })
        .catch(console.error);
});

// Закрытие экрана успешного заказа
events.on("success:close", () => {
    modal.close();
});

// ---- Загрузка товаров с сервера ----
api
    .getProducts()
    .then((items) => {
        productsModel.setItems(items);
    })
    .catch(console.error);
