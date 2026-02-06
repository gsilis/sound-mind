import { CollisionGroupManager } from "excalibur"
import { ElementFactory } from "./components/element-factory"

let _data: GameData

export class GameData {
  private _elementFactory?: ElementFactory
  private constructor() {}

  public playerCollisionGroup = CollisionGroupManager.create('player')
  public targetCollisionGroup = CollisionGroupManager.create('enemy')

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