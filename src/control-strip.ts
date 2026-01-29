export class ControlStrip {
  private _root?: HTMLElement
  private _listeners: [] = []

  setup(root: HTMLElement) {
    this._root = root
  }

  teardown() {

  }
}