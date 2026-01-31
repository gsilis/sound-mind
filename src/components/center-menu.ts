import { Actor } from "excalibur";
import { Menu } from "./menu";
import { ElementFactory } from "./element-factory";
import { GameData } from "../game-data";
import { removeFromParent } from "../utilities/dom";

export class CenterMenu extends Actor implements Menu {
  private _containerElement?: HTMLDivElement
  private get _container(): HTMLDivElement {
    if (!this._containerElement) {
      this._containerElement = document.createElement('div')
      this._containerElement.classList.add('menu', 'centered')
      this._containerElement.style.flexDirection = 'column'
      this._containerElement.style.width = '100%'

      GameData.getInstance().root.append(this._containerElement)
    }

    return this._containerElement
  }

  setup(setupCallback: (factory: ElementFactory) => HTMLElement[]) {
    try {
      const elements = setupCallback.apply(undefined, [GameData.getInstance().elementFactory])
      
      elements.forEach(el => {
        this._container.append(el)
      })
    } catch (err) {}
  }

  teardown(): void {
    GameData.getInstance().elementFactory.clear()
    removeFromParent(this._container)
  }
}