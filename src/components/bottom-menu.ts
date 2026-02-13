import { Actor } from "excalibur";
import { Menu } from "./menu";
import { ElementFactory } from "./element-factory";
import { GameData } from "../game-data";
import { removeFromParent } from "../utilities/dom";

export class BottomMenu extends Actor implements Menu {
  private _containerElement?: HTMLDivElement
  private _disabled: boolean = false
  private _elements: HTMLElement[] = []
  private get _container(): HTMLDivElement {
    if (!this._containerElement) {
      this._containerElement = document.createElement('div')
      this._containerElement.classList.add('menu', 'bottom')
      this._containerElement.style.flexDirection = 'row'
      this._containerElement.style.width = '100%'

      GameData.getInstance().root.append(this._containerElement)
    }

    return this._containerElement
  }

  get disabled() { return this._disabled }
  set disabled(value: boolean) {
    this._disabled = value
    this._elements.forEach((element) => {
      if (element instanceof HTMLButtonElement) {
        element.disabled = this._disabled
      }
    })
  }

  setup(setupCallback: (factory: ElementFactory) => HTMLElement[]): void {
    try {
      this._elements = setupCallback.apply(undefined, [GameData.getInstance().elementFactory])
      this._elements.forEach(el => {
        this._container.append(el)
      })
    } catch (err) {}
  }

  teardown(): void {
    GameData.getInstance().elementFactory.clear()
    removeFromParent(this._container)
  }
}