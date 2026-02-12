const template = `
  <style>
    .root {
      padding: 5px;
    }

    .control {
      --primary-color: white;
      --secondary-color: oklch(from var(--primary-color) calc(l - 0.2) c h);

      transition: all;
      transition-duration: 0.2s;
      padding: 2em;
      border-radius: 2em;
      line-height: 0px;
      position: relative;
      cursor: pointer;
      background: linear-gradient(to bottom, var(--primary-color) 0%, var(--secondary-color) 100%);
      border: 2px solid var(--secondary-color);
    }

    .control:hover {
      background: linear-gradient(to bottom, var(--primary-color) 50%, var(--secondary-color) 100%);
    }

    .control:active {
      --primary-color: oklch(from white calc(l - 0.25) c h);
      --secondary-color: oklch(from white calc(l - 0.25) c h);
    }

    .control:disabled {
      pointer-events: none;
      opacity: 0.8;
    }

    .control span {
      position: absolute;
      font-size: 30px;
      line-height: 30px;
      top: 0.5em;
      left: 0.5em;
    }
  </style>
  <div className="root">
    <button class="control" title="Record a clip">
      <span></span>
    </button>
  </div>
`

export class LaunchRecordButton extends HTMLElement {
  private _button?: HTMLButtonElement | null
  private _label?: HTMLSpanElement | null

  connectedCallback() {
    this.innerHTML = template

    this._button = this.querySelector<HTMLButtonElement>('button')
    this._label = this.querySelector<HTMLSpanElement>('span')

    if (this._label) this._label.innerText = '🎙️'
    if (this._button) this._button.addEventListener('click', this.onClick)
  }

  disconnectedCallback() {
    if (this._button) this._button.removeEventListener('click', this.onClick)
  }

  onClick = () => {
    console.log('launch recorder!')
  }
}

if (customElements && !customElements.get('launch-record-button')) {
  customElements.define('launch-record-button', LaunchRecordButton)
}