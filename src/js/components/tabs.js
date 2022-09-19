export function tabs() {

  //Tabs 
  const tabHeaders = document.querySelectorAll('[data-tab]');
  const contentBoxes = document.querySelectorAll('[data-tab-content]');

  tabHeaders.forEach(function (item) {
    item.addEventListener('click', function () {
      contentBoxes.forEach(function (item) {
        item.classList.add('tab-card_hidden');
      });
      const contentBox = document.querySelector('#' + this.dataset.tab);
      contentBox.classList.remove('tab-card_hidden');
    });
  });

  //Tabs active
  let tabs = document.querySelectorAll('.tab__item')

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach((tab) => {
        tab.classList.remove('tab__item_active')
      });
      tabs[index].classList.add('tab__item_active');
    });
  });
}
