"use strict";

/**
 * @property {Object} settings Объект с настройками галереи.
 * @property {string} settings.previewSelector Селектор обертки для миниатюр галереи.
 * @property {string} settings.openedImageWrapperClass Класс для обертки открытой картинки.
 * @property {string} settings.openedImageClass Класс открытой картинки.
 * @property {string} settings.openedImageScreenClass Класс для ширмы открытой картинки.
 * @property {string} settings.openedImageCloseBtnClass Класс для картинки кнопки закрыть.
 * @property {string} settings.openedImageCloseBtnSrc Путь до картинки кнопки открыть.
 * @property {string} settings.errorImageSrc Путь до картинки заглушки.
 * @property {string} settings.nextBtnClass Класс для кнопки следующая картинка
 * @property {string} settings.prevBtnClass Класс для кнопки предыдущая картинка
 * @property {string} settings.openedImageEl Картинка по которой был клик
 
 */
const gallery = {
  settings: {
    previewSelector: '.mySuperGallery',
    openedImageWrapperClass: 'galleryWrapper',
    openedImageClass: 'galleryWrapper__image',
    openedImageScreenClass: 'galleryWrapper__screen',
    openedImageCloseBtnClass: 'galleryWrapper__close',
    openedImageCloseBtnSrc: 'images/gallery/close.png',
    errorImageSrc: 'images/gallery/error.jpg',
    nextBtnClass: 'galleryWrapperNext',
    prevBtnClass: 'galleryWrapperPrev',
    openedImageEl: '',
  },

  /**
   * Инициализирует галерею, ставит обработчик события.
   * @param {Object} userSettings Объект настроек для галереи.
   */
  init(userSettings = {}) {
    // Записываем настройки, которые передал пользователь в наши настройки.
    Object.assign(this.settings, userSettings);

    // Находим элемент, где будут превью картинок и ставим обработчик на этот элемент,
    // при клике на этот элемент вызовем функцию containerClickHandler в нашем объекте
    // gallery и передадим туда событие MouseEvent, которое случилось.
    document
      .querySelector(this.settings.previewSelector)
      .addEventListener('click', event => this.containerClickHandler(event));
  },

  /**
   * Обработчик события клика для открытия картинки.
   * @param {MouseEvent} event Событие клики мышью.
   * @param {HTMLElement} event.target Целевой объект, куда был произведен клик.
   */
  containerClickHandler(event) {
    // Если целевой тег не был картинкой, то ничего не делаем, просто завершаем функцию.
    if (event.target.tagName !== 'IMG') {
      return;
    }
    // Открываем картинку с полученным из целевого тега (data-full_image_url аттрибут).
    this.openImage(event.target.dataset.full_image_url);
  },

  /**
   * Открывает картинку.
   * @param {string} src Ссылка на картинку, которую надо открыть.
   */
  openImage(src) {
    // Получаем контейнер для открытой картинки, в нем находим тег img и ставим ему нужный src.
    let img = this.getScreenContainer().querySelector(`.${this.settings.openedImageClass}`);
    img.src = src;
    // При ошибке загрузки картинки, ставим заглушку
    img.onerror = () => img.src = this.settings.errorImageSrc;
    // Сохраним открытую картинку в настройки
    let imgs = document.querySelector(this.settings.previewSelector).querySelectorAll('img');
    imgs.forEach(image => {
      if (image.dataset.full_image_url === src){
        return this.settings.openedImageEl = image
      }
    });
  },

  /**
   * Возвращает контейнер для открытой картинки, либо создает такой контейнер, если его еще нет.
   * @returns {Element}
   */
  getScreenContainer() {
    // Получаем контейнер для открытой картинки.
    const galleryWrapperElement = document.querySelector(`.${this.settings.openedImageWrapperClass}`);
    // Если контейнер для открытой картинки существует - возвращаем его.
    if (galleryWrapperElement) {
      return galleryWrapperElement;
    }

    // Возвращаем полученный из метода createScreenContainer контейнер.
    return this.createScreenContainer();
  },

  /**
   * Создает контейнер для открытой картинки.
   * @returns {HTMLElement}
   */
  createScreenContainer() {
    // Создаем сам контейнер-обертку и ставим ему класс.
    const galleryWrapperElement = document.createElement('div');
    galleryWrapperElement.classList.add(this.settings.openedImageWrapperClass);

    // Создаем контейнер занавеса, ставим ему класс и добавляем в контейнер-обертку.
    const galleryScreenElement = document.createElement('div');
    galleryScreenElement.classList.add(this.settings.openedImageScreenClass);
    galleryWrapperElement.appendChild(galleryScreenElement);

    // Создаем картинку для кнопки закрыть, ставим класс, src и добавляем ее в контейнер-обертку.
    const closeImageElement = new Image();
    closeImageElement.classList.add(this.settings.openedImageCloseBtnClass);
    closeImageElement.src = this.settings.openedImageCloseBtnSrc;
    closeImageElement.addEventListener('click', () => this.close());
    galleryWrapperElement.appendChild(closeImageElement);

    // Создаем картинку, которую хотим открыть, ставим класс и добавляем ее в контейнер-обертку.
    const image = new Image();
    image.classList.add(this.settings.openedImageClass);
    galleryWrapperElement.appendChild(image);

    // Создаем кнопки для слайдера
    const nextBtnElement = document.createElement('div');
    nextBtnElement.classList.add(this.settings.nextBtnClass);
    nextBtnElement.innerHTML = '&#8250;';
    nextBtnElement.addEventListener('click', () => this.getNextImg());
    const prevBtnElement = document.createElement('div');
    prevBtnElement.classList.add(this.settings.prevBtnClass);
    prevBtnElement.innerHTML = '&#8249;';
    prevBtnElement.addEventListener('click', () => this.getPrevImg());
    galleryWrapperElement.appendChild(nextBtnElement);
    galleryWrapperElement.appendChild(prevBtnElement);


    // Добавляем контейнер-обертку в тег body.
    document.body.appendChild(galleryWrapperElement);

    // Возвращаем добавленный в body элемент, наш контейнер-обертку.
    return galleryWrapperElement;
  },

  /**
   * Закрывает (удаляет) контейнер для открытой картинки.
   */
  close() {
    document.querySelector(`.${this.settings.openedImageWrapperClass}`).remove();
  },

  /**
   * Находит следующую картинку и вызывает метод открытия картинки
   */
  getNextImg() {
    // Так не получилось найти, путь прописывает абсолютный
    // // Получаем src открытой картинки
    // let src = document.querySelector(`.${this.settings.openedImageClass}`).src;
    // // Находим маленькую картинку в DOM
    // let images = document.querySelectorAll('img');
    // let image = images.forEach(image => image.dataset.full_image_url === src);
    // console.log(image);
    
    // Найдем следующую картинку
    let nextImg = this.settings.openedImageEl.nextElementSibling;
    // Если дошли до конца, возьмем первую
    if (nextImg === null) {
      nextImg = document.querySelector(this.settings.previewSelector).querySelector('img:first-child');
    }
    this.openImage(nextImg.dataset.full_image_url);

  },

  /**
   * Находит предыдущую картинку и вызывает метод открытия картинки
   */
  getPrevImg() {
    // Найдем следующую картинку
    let prevImg = this.settings.openedImageEl.previousElementSibling;
    // Если дошли до конца, возьмем первую
    if (prevImg === null) {
      prevImg = document.querySelector(this.settings.previewSelector).querySelector('img:last-child');
    }
    this.openImage(prevImg.dataset.full_image_url);
  }
};

// Инициализируем нашу галерею при загрузке страницы.
window.onload = () => gallery.init({previewSelector: '.galleryPreviewsContainer'});