import { Color, Engine, Font, Label, Scene, SceneActivationContext, TextAlign } from "excalibur";
import { FONT_TITLE } from "./fonts";
import { setupSteps } from "./setup-steps";

export class StartGameLevel extends Scene {
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

  override onInitialize(engine: Engine): void {
    const startHandler = (event: Event) => {
      event.target?.removeEventListener('click', startHandler)
      this.onStart(engine)
    }
    const startWithDefaultsHandler = (event: Event) => {
      event.target?.removeEventListener('click', startWithDefaultsHandler)
      this.onStartDefaults(engine)
    }

    this._startGame.addEventListener('click', startHandler)
    this._startWithDefaults.addEventListener('click', startWithDefaultsHandler)

    const font = FONT_TITLE
    const whiteLabel = new Label({ text: 'Sound Mind', font, color: Color.White })
    const blackLabel = new Label({ text: 'Sound Mind', font, color: Color.Black })
    const centerx = engine.screen.halfCanvasWidth
    const centery = engine.screen.halfCanvasHeight - 150

    whiteLabel.pos.x = centerx
    whiteLabel.pos.y = centery
    blackLabel.pos.x = centerx + 5
    blackLabel.pos.y = centery + 7

    this.add(blackLabel)
    this.add(whiteLabel)
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

  private onStart(engine: Engine) {
    engine.goToScene('audioShoot', {
      sceneActivationData: {
        sceneName: setupSteps[0].sceneName
      }
    })
  }

  private onStartDefaults(engine: Engine) {
    engine.goToScene('game')
  }
}