import { select } from '../settings.js';
import AmountWidget from './AmountWidget.js';

class CartProduct {
  constructor(menuProduct, element) {
    const thisCartProduct = this;
    console.log(menuProduct);
    thisCartProduct.amount = menuProduct.amount;
    thisCartProduct.id = menuProduct.id;
    thisCartProduct.name = menuProduct.name; 
    thisCartProduct.params = menuProduct.params;
    thisCartProduct.price = menuProduct.price;
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    thisCartProduct.getElements(element);
    thisCartProduct.initAmountWidget();
    thisCartProduct.initActions();
  }

  getElements(element) {
    const thisCartProduct = this;
    thisCartProduct.dom = {};
    thisCartProduct.dom.wrapper = element;
    thisCartProduct.dom.amountWidget =
      thisCartProduct.dom.wrapper.querySelector(
        select.cartProduct.amountWidget
      );
    thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(
      select.cartProduct.price
    );
    thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(
      select.cartProduct.edit
    );
    thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(
      select.cartProduct.remove
    );
    thisCartProduct.dom.input = thisCartProduct.dom.wrapper.querySelector(
      select.widgets.amount.input
    );
  }

  initAmountWidget() {
    const thisCartProduct = this;
    thisCartProduct.amountWidget = new AmountWidget(
      thisCartProduct.dom.amountWidget
    );
    thisCartProduct.dom.amountWidget.addEventListener('updated', function () {
      console.log('Element was changed!');
      thisCartProduct.price =
        thisCartProduct.dom.input.value * thisCartProduct.priceSingle;
      thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
      thisCartProduct.amount = thisCartProduct.amountWidget.value;
      console.log('thisCartProduct.amount: ' + thisCartProduct.amount);
    });
  }

  remove() {
    const thisCartProduct = this;
    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct,
      },
    });
    thisCartProduct.dom.wrapper.dispatchEvent(event);
    console.log('CartProductRemove');
  }

  initActions() {
    const thisCartProduct = this;
    thisCartProduct.dom.edit.addEventListener('click', function (event) {
      event.preventDefault();
      console.log('Edit!');
    });
    thisCartProduct.dom.remove.addEventListener('click', function (event) {
      event.preventDefault();
      console.log('Remove!');
      thisCartProduct.remove();
    });
  }

  getData() {
    const thisCartProduct = this;
    const detail = {
      id: thisCartProduct.id,
      amount: thisCartProduct.amount,
      price: thisCartProduct.price,
      priceSingle: thisCartProduct.priceSingle,
      name: thisCartProduct.name,
      params: thisCartProduct.params,
    };
    console.log('detail: ', detail);
    return detail;
  }
}

export default CartProduct;
