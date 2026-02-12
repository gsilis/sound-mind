import { Actor, ActorArgs } from "excalibur";
import { Menu } from "./menu";
import { ElementFactory } from "./element-factory";
import { GameData } from "../game-data";
import { removeFromParent } from "../utilities/dom";

export const DIRECTION_VERTICAL = 'vertical'
export const DIRECTION_HORIZONTAL = 'horizontal'
type ItemDirection = typeof DIRECTION_VERTICAL | typeof DIRECTION_HORIZONTAL

type CenterMenuOpts = { direction?: ItemDirection } & ActorArgs

export class CenterMenu extends Actor implements Menu {
  private _containerElement?: HTMLDivElement
  private _direction: ItemDirection = DIRECTION_VERTICAL

  private get _container(): HTMLDivElement {
    if (!this._containerElement) {
      this._containerElement = document.createElement('div')
      this._containerElement.classList.add('menu', 'centered')
      this._containerElement.style.flexDirection = this._direction === DIRECTION_HORIZONTAL ? 'row' : 'column'
      this._containerElement.style.width = '100%'

      GameData.getInstance().root.append(this._containerElement)
    }

    return this._containerElement
  }

  get direction() { return this._direction }
  set direction(value: ItemDirection) {
    this._direction = value
    this._container.style.flexDirection = this._direction === DIRECTION_HORIZONTAL ? 'row' : 'column'
  }

  constructor({ direction = DIRECTION_VERTICAL, ...actorArgs }: CenterMenuOpts = {}) {
    super(actorArgs)

    this._direction = direction
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