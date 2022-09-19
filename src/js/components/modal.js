export function modal() {
  const modalBtn = document.querySelectorAll('.modal-btn')
  const modalOverlay = document.querySelector('.modal__overlay')
  const modal = document.querySelectorAll('.modal__content')
  const modalClose = document.querySelector('.modal__close')


  modalBtn.forEach((el) => {
    el.addEventListener('click', (e) => {
      let modalBtnPath = e.currentTarget.getAttribute('data-path')
      modal.forEach((el) => {
        el.classList.remove('modal_visible')
      })
      document.querySelector(`[data-target="${modalBtnPath}"]`).classList.add('modal_visible')
      modalOverlay.classList.add('modal__overlay_visible')
    })
  })
  modalClose.addEventListener('click', (e) => {
    modalOverlay.classList.remove('modal__overlay_visible')
    modal.forEach((el) => {
      el.classList.remove('modal__overlay_visible')
    })
  })
}
