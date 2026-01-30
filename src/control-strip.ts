export type StripDirection = 'horizontal' | 'vertical'

export class ControlStrip {
  private _root?: HTMLElement
  private _baseName?: string
  private _direction: StripDirection = 'horizontal'

  private get _buttonGroup(): HTMLDivElement {
    if (!this._root || !this._baseName) { throw new Error('Cannot use before _root is set') }
    const containerClassName = `${this._baseName}-container`

    let el = this._root.querySelector('.' + containerClassName) as HTMLDivElement
    if (!el) {
      const menuDirection = `menu-${this._direction}`
      el = document.createElement('div') as HTMLDivElement
      el.classList.add('menu', menuDirection, containerClassName)
      this._root.appendChild(el)
    }

    return el
  }

  get nextButton(): HTMLButtonElement {
    let el = this._buttonGroup.querySelector(`.next-button`) as HTMLButtonElement
    if (!el) {
      el = document.createElement('button') as HTMLButtonElement
      el.classList.add('next-button', 'primary')
      this._buttonGroup.appendChild(el)
    }

    return el
  }

  get previousButton(): HTMLButtonElement {
    let el = this._buttonGroup.querySelector(`.prev-button`) as HTMLButtonElement
    if (!el) {
      el = document.createElement('button') as HTMLButtonElement
      el.classList.add('prev-button')
      this._buttonGroup.appendChild(el)
    }

    return el
  }

  setup(root: HTMLElement, baseName: string) {
    this._root = root
    this._baseName = baseName

    this.previousButton, this.nextButton
  }

  teardown() {
    [
      this.nextButton,
      this.previousButton,
      this._buttonGroup
    ].forEach(dom => {
      if (dom.parentElement) dom.parentElement.removeChild(dom)
    })
  }
}