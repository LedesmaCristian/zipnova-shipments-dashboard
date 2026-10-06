import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// jsdom no implementa <dialog>.showModal()/close(); alcanza con reflejar el atributo `open`.
function showModal(this: HTMLDialogElement) {
  this.setAttribute('open', '')
}

function close(this: HTMLDialogElement) {
  this.removeAttribute('open')
  this.dispatchEvent(new Event('close'))
}

if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = showModal
  HTMLDialogElement.prototype.close = close
}

afterEach(() => {
  cleanup()
})
