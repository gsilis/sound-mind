export class CounterComponent extends HTMLElement {
  static observedAttributes = ['run']
  private _run = false
  private _startedAtTimestamp: number = 0
  private _duration: number = 0

  get duration() { return this._duration }

  get run() { return this._run }
  set run(value: boolean) {
    if (!this._run && value) {
      this._duration = 0
      this._startedAtTimestamp = Date.now()
      this.count()
    }

    this._run = value
  }

  connectedCallback() {
    this.style.fontFamily = 'monospace'
    this.update()
  }

  private count = () => {
    requestAnimationFrame(() => {
      this._duration = Date.now() - this._startedAtTimestamp
      this.update()

      if (this._run) {
        this.count()
      }
    })
  }

  private update = () => {
    const display = (this._duration / 1000).toFixed(3).replace(/\./, ':')

    this.innerText = display
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'run') {
      this.run = newValue === 'true'
    }
  }
}

if (customElements && !customElements.get('counter-component')) {
  customElements.define('counter-component', CounterComponent)
}