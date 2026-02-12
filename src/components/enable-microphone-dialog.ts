export class EnableMicrophoneDialog extends HTMLElement {
  static TEMPLATE_NAME = 'template#enable-audio'

  private _dialog?: HTMLDialogElement | null
  private _enableButton?: HTMLButtonElement | null
  private _cancelButton?: HTMLButtonElement | null

  connectedCallback() {
    const template = document.querySelector<HTMLTemplateElement>(EnableMicrophoneDialog.TEMPLATE_NAME)

    if (!template) {
      throw new Error(`Template with selector '${EnableMicrophoneDialog.TEMPLATE_NAME}' is missing from the DOM.`)
    }

    const clone = template.cloneNode()
    this.append(clone)

    this._dialog = this.querySelector('dialog')
    this._enableButton = this.querySelector('button.trigger-prompt')
    this._cancelButton = this.querySelector('button.cancel')

    if (this._cancelButton) {
      this._cancelButton.addEventListener('click', this.onCancel)
    }

    if (this._enableButton) {
      this._enableButton.addEventListener('click', this.onEnable)
    }

    if (this._dialog) {
      this._dialog.show()
    }
  }

  onCancel = () => {
    console.log('CANCEL')
  }

  onEnable = () => {
    console.log('ENABLE')
  }
}

if (customElements && !customElements.get('enable-microphone-dialog')) {
  customElements.define('enable-microphone-dialog', EnableMicrophoneDialog)
}