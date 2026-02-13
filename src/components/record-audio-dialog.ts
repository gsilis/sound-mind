export class RecordAudioDialog extends HTMLElement {
  static TEMPLATE_NAME = 'template#record-audio'

  private _dialog?: HTMLDialogElement | null
  private _cancelButton?: HTMLButtonElement | null
  private _confirmButton?: HTMLButtonElement | null
  private _recordAudioButton?: HTMLButtonElement | null
  private _playAudioButton?: HTMLButtonElement | null

  constructor() {
    super()
    this.classList.add('dialog-container')
  }

  connectedCallback() {
    const template = document.querySelector<HTMLTemplateElement>(RecordAudioDialog.TEMPLATE_NAME)

    if (!template) {
      throw new Error(`Template with selector '${RecordAudioDialog.TEMPLATE_NAME}' is missing from the DOM.`)
    }

    this.innerHTML = template.innerHTML

    this._dialog = this.querySelector('dialog')
    this._cancelButton = this._dialog?.querySelector('button.cancel-dialog')
    this._confirmButton = this._dialog?.querySelector('button.confirm-dialog')
    this._recordAudioButton = this._dialog?.querySelector('button.record-audio')
    this._playAudioButton = this._dialog?.querySelector('button.play-audio')

    if (this._cancelButton) this._cancelButton.addEventListener('click', this.onCancel)
    if (this._confirmButton) this._confirmButton.addEventListener('click', this.onConfirm)
  }

  disconnectedCallback() {
    if (this._cancelButton) this._cancelButton.removeEventListener('click', this.onCancel)
    if (this._confirmButton) this._confirmButton.removeEventListener('click', this.onConfirm)
  }

  onConfirm = () => {
    this.dispatchEvent(new CustomEvent('confirm', { detail: null }))
  }

  onCancel = () => {
    this.dispatchEvent(new Event('cancel'))
  }

  hideElement = (possibleElement?: HTMLElement | null) => {
    if (possibleElement) possibleElement.style.display = 'none'
  }

  showElement = (possibleElement?: HTMLElement | null) => {
    if (possibleElement) possibleElement.style.display = 'auto'
  }
}

if (customElements && !customElements.get('record-audio-dialog')) {
  customElements.define('record-audio-dialog', RecordAudioDialog)
}