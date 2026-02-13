export class EnableMicrophoneDialog extends HTMLElement {
  static TEMPLATE_NAME = 'template#enable-audio'

  private _dialog?: HTMLDialogElement | null
  private _enableButton?: HTMLButtonElement | null
  private _cancelButton?: HTMLButtonElement | null
  private _waitingIcon?: HTMLSpanElement | null
  private _confirmedIcon?: HTMLSpanElement | null
  private _declinedIcon?: HTMLSpanElement | null
  private _introBlock?: HTMLDivElement | null
  private _errorBlock?: HTMLDivElement | null

  constructor() {
    super()
    this.classList.add('dialog-container')
  }

  connectedCallback() {
    const template = document.querySelector<HTMLTemplateElement>(EnableMicrophoneDialog.TEMPLATE_NAME)

    if (!template) {
      throw new Error(`Template with selector '${EnableMicrophoneDialog.TEMPLATE_NAME}' is missing from the DOM.`)
    }

    this.innerHTML = template.innerHTML

    this._dialog = this.querySelector('dialog')
    this._enableButton = this.querySelector('button.trigger-prompt')
    this._cancelButton = this.querySelector('button.cancel')
    this._confirmedIcon = this.querySelector('span.dialog-icon.confirmed')
    this._declinedIcon = this.querySelector('span.dialog-icon.declined')
    this._waitingIcon = this.querySelector('span.dialog-icon.waiting')
    this._introBlock = this.querySelector('div.intro')
    this._errorBlock = this.querySelector('div.error')

    this.hideAllIcons()
    this.hideElement(this._errorBlock)
    this.showElement(this._cancelButton)

    if (this._cancelButton) {
      this._cancelButton.addEventListener('click', this.onCancel)
    }

    if (this._enableButton) {
      this._enableButton.addEventListener('click', this.onEnable)
    }

    if (this._enableButton) {
      this._enableButton.disabled = false
    }

    if (this._dialog) {
      this._dialog.show()
    }
  }

  onCancel = () => {
    this.hideAllIcons()
    this.hideElement(this._errorBlock)
    this.showElement(this._introBlock)
    this.showElement(this._enableButton)

    this.dispatchEvent(new Event('cancel'))
  }

  onEnable = async () => {
    this.hideAllIcons()
    this.showElement(this._waitingIcon)
    this.hideElement(this._errorBlock)
    this.hideElement(this._introBlock)

    if (this._cancelButton) this._cancelButton.disabled = true
    if (this._enableButton) this._enableButton.disabled = true

    let result
    try {
      result = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
    } catch (err) {}
    
    this.hideAllIcons()

    if (result) {
      this.showElement(this._confirmedIcon)
      this.hideElement(this._waitingIcon)
      this.hideElement(this._cancelButton)
      
      setTimeout(() => {
        this.dispatchEvent(new CustomEvent('confirm', { detail: result }))
      }, 1000)
    } else {
      this.hideElement(this._enableButton)
      this.showElement(this._declinedIcon)
      this.hideElement(this._introBlock)
      this.showElement(this._errorBlock)

      if (this._cancelButton) this._cancelButton.disabled = false
    }
  }

  private hideAllIcons() {
    [this._confirmedIcon, this._declinedIcon, this._waitingIcon].forEach((icon) => {
      if (icon) icon.style.display = 'none'
    })
  }

  private hideElement(possibleElement?: HTMLElement | null) {
    if (possibleElement) possibleElement.style.display = 'none'
  }

  private showElement(possibleElement?: HTMLElement | null) {
    if (possibleElement) possibleElement.style.display = 'inline-block'
  }
}

if (customElements && !customElements.get('enable-microphone-dialog')) {
  customElements.define('enable-microphone-dialog', EnableMicrophoneDialog)
}