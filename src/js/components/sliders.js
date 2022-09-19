import Swiper, { Pagination } from 'swiper';

export function slider() {
  const swiper = new Swiper('.main-block', {
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 5,
    pagination: {
      el: '.swiper-pagination',
    },
    modules: [Pagination],
  });
}