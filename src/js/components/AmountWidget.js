import { settings, select } from '../settings.js';

class AmountWidget {
  constructor(element) {
    const thisWidget = this;
    thisWidget.getElements(element);
    thisWidget.setValue(
      thisWidget.input.value || settings.amountWidget.defaultValue
    );
    thisWidget.initActions();
  }

  getElements(element) {
    const thisWidget = this;
    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(
      select.widgets.amount.input
    );
    thisWidget.linkDecrease = thisWidget.element.querySelector(
      select.widgets.amount.linkDecrease
    );
    thisWidget.linkIncrease = thisWidget.element.querySelector(
      select.widgets.amount.linkIncrease
    );
  }

  setValue(value) {
    const thisWidget = this;
    const newValue = parseInt(value);

    if (
      thisWidget.value !== newValue &&
      !isNaN(newValue) &&
      newValue >= settings.amountWidget.defaultMin &&
      newValue <= settings.amountWidget.defaultMax
    ) {
      thisWidget.value = newValue;
      console.log('thisWidget.value: ' + thisWidget.value);
      thisWidget.announce();
    }

    thisWidget.input.value = thisWidget.value;
  }

  initActions() {
    const thisWidget = this;
    thisWidget.input.addEventListener('change', function () {
      thisWidget.setValue(thisWidget.input.value);
    });
    thisWidget.linkDecrease.addEventListener('click', function () {
      thisWidget.value -= 1;
      thisWidget.setValue(thisWidget.value);
      thisWidget.announce();
    });
    thisWidget.linkIncrease.addEventListener('click', function () {
      thisWidget.value += 1;
      thisWidget.setValue(thisWidget.value);
      thisWidget.announce();
    });
  }

  announce() {
    const thisWidget = this;
    const event = new CustomEvent('updated', {
      bubbles: true,
    });
    thisWidget.element.dispatchEvent(event);
  }
}

export default AmountWidget;
