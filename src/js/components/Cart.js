import { settings, select, classNames, templates } from '../settings.js';
import CartProduct from './CartProduct.js';
import utils from '../utils.js';

class Cart {
  constructor(element) {
    const thisCart = this;
    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.initActions();
    thisCart.update();
    console.log('new Cart: ', thisCart);
  }

  getElements(element) {
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(
      select.cart.toggleTrigger
    );
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(
      select.cart.productList
    );
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(
      select.cart.deliveryFee
    );
    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(
      select.cart.subtotalPrice
    );
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(
      select.cart.totalNumber
    );
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(
      select.cart.totalPrice
    );

    // Zacznij od przygotowania referencji do elementu formularza. thisCart.dom.form powinien kierować do elementu ukrytego pod selektorem select.cart.form (to nasz formularz)

    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(
      select.cart.address
    );
  }

  initActions() {
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function (event) {
      console.log('event.detail.cartProduct: ', event.detail.cartProduct);
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct) {
    const thisCart = this;
    // console.log('adding product', menuProduct);
    const generatedHTML = templates.cartProduct(menuProduct);
    /* create element using utils.createDOMFromHTML */

    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    // console.log('generatedHTML: ', generatedHTML);
    // console.log('generatedDOM: ', generatedDOM);
    thisCart.dom.productList.appendChild(generatedDOM);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    // console.log('thisCart.products: ', thisCart.products);
    // console.log('menuProduct: ', menuProduct);
    thisCart.update();
  }

  update() {
    const thisCart = this;
    let deliveryFee = settings.cart.defaultDeliveryFee;
    let totalNumber = 0;
    let subtotalPrice = 0;
    console.clear();
    console.log('Update!!!');
    for (let product of thisCart.products) {
      console.log('product: ', product);
      console.log('product.amount: ' + product.amount);
      totalNumber += product.amount;
      subtotalPrice += product.price;
      console.log('totalPrice: $' + (subtotalPrice + deliveryFee));
    }
    if (totalNumber == 0) {
      deliveryFee = 0;
    }
    thisCart.totalPrice = subtotalPrice + deliveryFee;
    thisCart.dom.deliveryFee.innerHTML = deliveryFee;
    for (let price of thisCart.dom.totalPrice) {
      price.innerHTML = thisCart.totalPrice;
    }
    thisCart.dom.totalNumber.innerHTML = totalNumber;
    thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;
    thisCart.subtotalPrice = subtotalPrice;
    thisCart.totalNumber = totalNumber;
    thisCart.deliveryFee = deliveryFee;
    console.log('totalNumber: ' + totalNumber);
  }

  remove(cartProduct) {
    const thisCart = this;
    cartProduct.dom.wrapper.remove();
    const currentIndex = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(currentIndex, 1);
    console.log('thisCart: ', thisCart);
    console.log('currentIndex: ' + currentIndex);
    thisCart.update();
  }

  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.orders;
    const payload = {
      phone: thisCart.dom.phone.value,
      address: thisCart.dom.address.value,
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };
    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    fetch(url, options)
      .then(function (response) {
        console.log('response: ', response);
        return response.json();
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse: ', parsedResponse);
      });
    console.log('payload: ', payload);
  }
}

export default Cart;
