import { Engine, Scene, SceneActivationContext } from "excalibur";
import { BottomMenu } from "../components/bottom-menu";
import { ElementFactory } from "../components/element-factory";
import { GameData } from "../game-data";

const gameData = GameData.getInstance()

export class AudioReport extends Scene {
  private _bottomMenu?: BottomMenu

  override onInitialize(engine: Engine): void {
    this._bottomMenu = new BottomMenu()
  }

  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
    super.onActivate(context)
    if (!this._bottomMenu) return

    this._bottomMenu.setup((elementFactory: ElementFactory) => {
      const elements: HTMLElement[] = []

      elements.push(elementFactory.createButton('Back', this.onBack))
      elements.push(elementFactory.createSpacer())
      elements.push(elementFactory.createPrimaryButton('Start', this.onStart))

      return elements
    })
  }

  override onDeactivate(context: SceneActivationContext) {
    super.onDeactivate(context)
    if (!this._bottomMenu) return

    this._bottomMenu.teardown()
  }

  private onBack = () => {
    this.engine.goToScene('audioExplosion', { sceneActivationData: { sceneName: 'audioExplosion' } })
  }

  private onStart = () => {
    this.engine.goToScene('game')
    gameData.start()
  }
}