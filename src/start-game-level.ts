import { Actor, Engine, ExcaliburGraphicsContext, Scene, SceneActivationContext, vec } from "excalibur";
import { setupSteps } from "./setup-steps";
import { GradientBackground } from "./components/gradient-background";
import { GameColor } from "./game-color";
import { Resources } from "./resources";

export class StartGameLevel extends Scene {
  private _multiplier: number = 0
  private _background?: GradientBackground
  private _logo: Actor = new Actor({ width: Resources.Logo.width, height: Resources.Logo.height })

  override onInitialize(engine: Engine): void {
    const { width, height } = engine.screen

    this._background = new GradientBackground({ width, height })
    this._background.from = GameColor.BRIGHT_BLUE
    this._background.to = GameColor.DARK_BLUE

    this._logo.graphics.add(Resources.Logo.toSprite())
  }

  override onActivate(_context: SceneActivationContext<unknown, undefined>): void {
    this._multiplier = 0
    this._background && this.add(this._background)
    this._logo && this.add(this._logo)

    const startHandler = (event: Event) => {
      event.target?.removeEventListener('click', startHandler)
      this.onStart()
    }
    const startWithDefaultsHandler = (event: Event) => {
      event.target?.removeEventListener('click', startWithDefaultsHandler)
      this.onStartDefaults()
    }

    this._logo.scale = vec(0, 0)
    this._logo.actions.scaleTo({ scale: vec(1, 1), duration: 500 })
  }

  override onDeactivate() {
    this._background && this.remove(this._background)
  }

  override onPreDraw(_ctx: ExcaliburGraphicsContext, elapsed: number): void {
    this._multiplier += elapsed

    const { width, height } = this.engine.screen
    const halfCanvasHeight = height / 2
    const halfCanvasWidth = width / 2
    const centerx = halfCanvasWidth
    const centery = halfCanvasHeight - 150

    if (this._background) {
      this._background.pos.x = halfCanvasWidth
      this._background.pos.y = halfCanvasHeight
    }

    if (this._logo) {
      this._logo.pos.x = centerx
      this._logo.pos.y = centery
    }
  }

  private onStart = () => {
    this.engine.goToScene('audioShoot', {
      sceneActivationData: {
        sceneName: setupSteps[0].sceneName
      }
    })
  }

  private onStartDefaults = () => {
    this.engine.goToScene('game')
  }
}