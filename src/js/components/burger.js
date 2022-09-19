export function burger() {
  const burgerActive = document.querySelector('.burger');

  burgerActive.addEventListener('click', () => {
    burgerActive.classList.toggle('burger_active');
  });

  const menuActive = document.querySelector('.menu__list');

  burgerActive.addEventListener('click', () => {
    menuActive.classList.toggle('menu__list_active');
  });

  //hidden scroll
  const bodyHidden = document.body;

  burgerActive.addEventListener('click', () => {
    bodyHidden.classList.toggle('body_hidden');
  });
}