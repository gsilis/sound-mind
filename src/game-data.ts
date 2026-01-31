import { ElementFactory } from "./components/element-factory"

let _data: GameData

export class GameData {
  private _elementFactory?: ElementFactory
  private constructor() {}

  static getInstance(): GameData {
    if (!_data) {
      _data = new GameData()
    }

    return _data
  }

  get elementFactory(): ElementFactory {
    if (!this._elementFactory) {
      this._elementFactory = new ElementFactory(document)
    }

    return this._elementFactory
  }

  get root(): HTMLDivElement {
    const dom = document.querySelector('body > div.container') as HTMLDivElement

    return dom || (document.createElement('div') as HTMLDivElement)
  }
}