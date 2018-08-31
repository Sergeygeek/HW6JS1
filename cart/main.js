// Инициализируем нашу корзину при загрузке страницы.
window.onload = () => cart.init({
  containerElId: 'goods',
  countSelector: '#cart-count',
  priceSelector: '#cart-total',
});

