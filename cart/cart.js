/**
 * @property {object} settings Настройки корзины
 * @property {{price: number, name: string}[]} goods Список купленных товаров
 * @property {HTMLElement} countEl Элемент, который показывает количество товара
 * @property {HTMLElement} priceEl Элемент, который показывает стоимость корзины
 */
const cart = {
  settings: {
    containerElId: 'wrapper',
    countSelector: '#basket-count',
    priceSelector: '#basket-price',
    buyBtnDataAtr: 'buy',
    delBtnDataAtr: 'del',
    clearBtnId: 'clear',
  },
  goods: [],
  countEl: null,
  priceEl: null,

  /**
   * Функция инициализации корзины
   * @param {object} userSettings Пользовательские настройки
   */
  init(userSettings = {}) {
    // Записываем настройки, которые передал пользователь в наши настройки.
    Object.assign(this.settings, userSettings);

    //Инициализируем элементы корзины
    this.countEl = document.querySelector(this.settings.countSelector);
    this.priceEl = document.querySelector(this.settings.priceSelector);

    // Инициализация списка
    if (!this.getGoodsFromLs()) {
      this.goods = [];
    } else {
      this.goods = this.getGoodsFromLs();
    }

    // Отрисуем корзину
    this.render();

    //Повесим обработчик событий на контэйнер
    document.getElementById(this.settings.containerElId)
    .addEventListener('click', event => this.containerClickHandler(event));
  },

  /**
   * Обработчик события клика для открытия картинки.
   * @param {MouseEvent} event Событие клики мышью.
   * @param {HTMLElement} event.target Целевой объект, куда был произведен клик.
   */
  containerClickHandler(event) {
    // Если целевой тег не был кнопкой, то ничего не делаем, просто завершаем функцию.
    if (event.target.tagName !== 'BUTTON') {
      return;
    }
    
    // Добавим товар в массив товаров
    if (event.target.dataset.action === 'buy'){
      let price = Number(event.target.dataset.price);
      let name = event.target.dataset.name;

      this.addGood(name, price);
    }

    // Удалим товар из массива товаров
    if (event.target.dataset.action === 'del'){
      let name = event.target.dataset.name;
      this.delGood(name);
    }

    // Очистим корзину
    if (event.target.id === 'clear'){
      this.clearCart();
    }
    //Отрисуем изменения в корзине, в соответствии с нажатой кнопкой
    this.render();
  },

  /**
   * Отображает количество товаров и стоимость корзины
   */
  render() {
    // Отобразим количество товара
    this.countEl.textContent = this.goods.length;
    // Отобразим стоимость товара
    this.priceEl.textContent = this.getGoodsPrice();
    // Отобразим товар
    if (document.querySelector('ul')) {
      document.querySelector('ul').remove();
    }
    const ul = document.createElement('ul');

    let li = '';

    for (let i = 0; i < this.goods.length; i++) {
      const name = this.goods[i].name;
      const price = this.goods[i].price;
      li += `<li>${name}: ${price} руб </li>`; 
    }

    ul.innerHTML = li;

    document.getElementById('cart').appendChild(ul);
  },
  
  /**
   *Сохраняет купленные товары в массив товаров
   *
   * @param {string} name Название товара
   * @param {number} price Цена товара
   */
  addGood(name, price) {
    this.goods.push({name: name, price: price});
    this.storeGoodInLs(this.goods);
  },

  /**
   *Функция считает стоимость всех тваров в корзине
   *
   * @returns {number} Сумма всех товаров в массиве
   */
  getGoodsPrice() {
    let goodsPrice = this.goods.reduce((sum, good) => sum + good.price, 0);
    return goodsPrice;
  },

  /**
   * Функция удаляет товар из корзины
   * @param {string} name Название товара
   */
  delGood(name) {
    // Найдем индекс товара в списке товаров
    let i = 0
    while(i < this.goods.length) {
      if (this.goods[i].name === name) {
        this.goods.splice(i, 1);
        //Удалим из LS
        this.delGoodFromLs(this.goods);
        return
      }
      i++;
    }
  },

  /**
   *Метод очищает корзину
   */
  clearCart() {
    // Очистим корзину
    this.goods = [];
    localStorage.setItem('goods', []);
  },


  /**
   * Сохраняет товары в локальное хранилище
   * @param {Object[]} goods Массив с товарами
   */
  storeGoodInLs(goods) {
    // Добавим массив в LS
    localStorage.setItem('goods', JSON.stringify(goods));
  },

  /**
   * Удаляет товар из локального хранилища
   * @param {Object[]} goods Массив с товарами
   */
  delGoodFromLs(goods) {
    localStorage.setItem('goods', JSON.stringify(goods));
  },

  /**
   *Функция получает список товаров из локального хранилища
   * @returns {Array} Список товаров
   */
  getGoodsFromLs() {
    if (!localStorage.getItem('goods')) {
      return [];
    }
    return JSON.parse(localStorage.getItem('goods'));
  }
  // Только сейчас понял, что лучше было вместо двух функций storeGoodInLs и delGoodFromLs
  // реализовать одну updateGoodsInLs))))
}