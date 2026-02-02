import { Actor, Color, Engine, ExcaliburGraphicsContext, Label, Rectangle, Scene, SceneActivationContext, vec } from "excalibur";
import { setupSteps, type SetupStep, defaultSetupStep } from "./setup-steps";
import { FONT_SUBHEAD } from "./fonts";
import { GradientBackground } from "./components/gradient-background";
import { ActorCreator } from "./utilities/actor-creator";
import { Resources } from "./resources";
import { GameColor } from "./game-color";

interface AudioSelectLevelData {
  sceneName: string
}

export class AudioSelectLevel extends Scene {
  private name: string = ''
  private titleLabel: Label = new Label({ font: FONT_SUBHEAD, color: Color.White })
  private imageContainer: Actor = new Actor()
  private _background?: GradientBackground
  private _border = ActorCreator.fromImage(Resources.IconBox)
  private _headerBackground?: GradientBackground
  private _footerBackground?: GradientBackground

  get config(): SetupStep {
    return setupSteps.find(s => s.sceneName === this.name) || defaultSetupStep
  }

  get nextPageConfig() {
    return setupSteps[setupSteps.indexOf(this.config) + 1]
  }
  get hasNextPage() {
    return this.nextPageConfig !== undefined
  }

  get prevPageConfig() {
    return setupSteps[setupSteps.indexOf(this.config) - 1]
  }
  get hasPrevPage() {
    return this.prevPageConfig !== undefined
  }

  override onActivate(context: SceneActivationContext<AudioSelectLevelData>): void {
    let sceneName = context.data?.sceneName
    if (sceneName === undefined) sceneName = defaultSetupStep.sceneName
    this.name = sceneName

    const { height, width } = this.engine.screen

    this._background = new GradientBackground({ width, height })
    this._background.from = GameColor.BRIGHT_BLUE
    this._background.to = GameColor.DARK_BLUE
    this._headerBackground = new GradientBackground({ width, height: height * 0.25 })
    this._headerBackground.from = GameColor.DARK_BLUE
    this._headerBackground.to = GameColor.DARK_BLUE
    this._footerBackground = new GradientBackground({ width, height: height * 0.15 })
    this._footerBackground.from = GameColor.DARK_BLUE
    this._footerBackground.to = GameColor.DARK_BLUE

    this.titleLabel.text = this.config.title
    this._background && this.add(this._background)
    this._headerBackground && this.add(this._headerBackground)
    this._footerBackground && this.add(this._footerBackground)
    this._border && this.add(this._border)
    this.add(this.titleLabel)
    this.add(this.imageContainer)
  }

  override onDeactivate(context: SceneActivationContext) {
    try {
      
    } catch (err) {
      console.group('AudioSelectLevel.onDeactivate: controlStrip teardown error')
      console.error(err)
      console.groupEnd()
    }
  }

  override onInitialize(engine: Engine): void {
    const halfWidth = engine.screen.halfCanvasWidth
    this.titleLabel.pos.x = halfWidth
    this.titleLabel.pos.y = 50
    this.titleLabel.text = this.config.title

    this.imageContainer.pos.x = halfWidth
    this.imageContainer.pos.y = 200
  }

  override onPreDraw(ctx: ExcaliburGraphicsContext, elapsed: number): void {
    const { width, height } = this.engine.screen
    const halfWidth = width / 2
    const halfHeight = height / 2
    const quarterHeight = halfHeight / 2
    const sixthHeight = height * 0.15
    this._background?.pos.setTo(halfWidth, halfHeight)
    this._headerBackground?.pos.setTo(halfWidth, quarterHeight / 2)
    this._footerBackground?.pos.setTo(halfWidth, height - (sixthHeight / 2))
    this._border.pos.setTo(halfWidth, halfHeight - 50)
    this.titleLabel.pos.x = halfWidth
    this.imageContainer.pos.setTo(halfWidth, halfHeight - 50)
  }

  onNextPage = () => {
    if (this.hasNextPage) {
      const nextSceneName = this.nextPageConfig.sceneName
      this.engine.goToScene(nextSceneName, { sceneActivationData: { sceneName: nextSceneName } })
    } else {
      this.engine.goToScene('game')
    }
  }

  onPreviousPage = () => {
    if (this.hasPrevPage) {
      const prevSceneName = this.prevPageConfig.sceneName
      this.engine.goToScene(prevSceneName, { sceneActivationData: { sceneName: prevSceneName } })
    } else {
      this.engine.goToScene('start')
    }
  }
}