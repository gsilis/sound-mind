import { Color, ExcaliburGraphicsContext, Label, Scene, SceneActivationContext, vec } from "excalibur";
import { FONT_TITLE } from "./fonts";
import { setupSteps } from "./setup-steps";

export class StartGameLevel extends Scene {
  private _multiplier: number = 0
  private whiteLabel?: Label
  private blackLabel?: Label

  private get _body(): HTMLBodyElement {
    return document.body as HTMLBodyElement
  }

  private get _buttonGroup(): HTMLDivElement {
    let div = document.querySelector('.menu.menu-vertical') as HTMLDivElement

    if (!div) {
      div = document.createElement('div') as HTMLDivElement
      div.classList.add('menu', 'menu-vertical')
      this._body.appendChild(div)
    }

    return div
  }

  private get _startGame(): HTMLButtonElement {
    let button = this._buttonGroup.querySelector('.start-game') as HTMLButtonElement

    if (!button) {
      button = document.createElement('button') as HTMLButtonElement
      button.classList.add('start-game', 'primary')
      button.innerText = 'Start Game'
      this._buttonGroup.appendChild(button)
    }

    return button
  }

  private get _startWithDefaults(): HTMLButtonElement {
    let button = this._buttonGroup.querySelector('.start-game-defaults') as HTMLButtonElement

    if (!button) {
      button = document.createElement('button') as HTMLButtonElement
      button.classList.add('start-game-defaults')
      button.innerText = 'Start with default sounds'
      this._buttonGroup.appendChild(button)
    }

    return button
  }

  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
    this._multiplier = 0

    const startHandler = (event: Event) => {
      event.target?.removeEventListener('click', startHandler)
      this.onStart()
    }
    const startWithDefaultsHandler = (event: Event) => {
      event.target?.removeEventListener('click', startWithDefaultsHandler)
      this.onStartDefaults()
    }

    this._startGame.addEventListener('click', startHandler)
    this._startWithDefaults.addEventListener('click', startWithDefaultsHandler)

    const font = FONT_TITLE
    this.whiteLabel = new Label({ text: 'Sound Mind', font, color: Color.White })
    this.blackLabel = new Label({ text: 'Sound Mind', font, color: Color.Black })
    const centerx = this.engine.screen.halfCanvasWidth
    const centery = this.engine.screen.halfCanvasHeight - 150

    this.whiteLabel.pos.x = centerx
    this.whiteLabel.pos.y = centery
    this.blackLabel.pos.x = centerx + 5
    this.blackLabel.pos.y = centery + 7

    this.add(this.blackLabel)
    this.add(this.whiteLabel)
  }

  override onDeactivate(context: SceneActivationContext) {
    [
      this._startGame,
      this._startWithDefaults,
      this._buttonGroup
    ].forEach((elem) => {
      if (elem.parentElement) {
        elem.parentElement.removeChild(elem)
      }
    })
  }

  override onPreDraw(ctx: ExcaliburGraphicsContext, elapsed: number): void {
    this._multiplier += elapsed
    const value = Math.sin(this._multiplier / 1000)
    const scaleValue = (0.05 * Math.sin(this._multiplier / 1300)) + 1

    if (this.whiteLabel) {
      this.whiteLabel.rotation = 0.02 * value
      this.whiteLabel.scale = vec(scaleValue, scaleValue)
    }

    if (this.blackLabel) {
      this.blackLabel.rotation = -0.03 * value
      this.blackLabel.scale = vec(scaleValue, scaleValue)
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