export class ModalManager {
  private _current?: HTMLElement | null
  private _root: HTMLElement

  constructor(root: HTMLElement) {
    this._root = root
  }

  show(element: HTMLElement | null) {
    if (this._current) {
      this._root.removeChild(this._current)
    }

    this._current = element

    if (this._current) {
      this._root.appendChild(this._current)
    }
  }
}