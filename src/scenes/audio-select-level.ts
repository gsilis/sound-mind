import { Actor, Color, Engine, ExcaliburGraphicsContext, Label, Scene, SceneActivationContext, vec } from "excalibur";
import { setupSteps, type SetupStep, defaultSetupStep } from "./setup-steps";
import { FONT_SUBHEAD } from "../fonts";
import { GradientBackground } from "../components/gradient-background";
import { ActorCreator } from "../utilities/actor-creator";
import { Resources } from "../resources";
import { GameColor } from "../game-color";
import { BottomMenu } from "../components/bottom-menu";
import { ElementFactory } from "../components/element-factory";

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
  private _bottomMenu?: BottomMenu

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

  override onInitialize(engine: Engine): void {
    const halfWidth = engine.screen.halfCanvasWidth

    this.titleLabel.pos.x = halfWidth
    this.titleLabel.pos.y = 50
    this.titleLabel.text = this.config.title

    this.imageContainer.pos.x = halfWidth
    this.imageContainer.pos.y = 200

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

    this._background && this.add(this._background)
    this._headerBackground && this.add(this._headerBackground)
    this._footerBackground && this.add(this._footerBackground)
    this._border && this.add(this._border)

    this.add(this.titleLabel)
    this.add(this.imageContainer)
  }

  override onActivate(context: SceneActivationContext<AudioSelectLevelData>): void {
    let sceneName = context.data?.sceneName
    if (sceneName === undefined) sceneName = defaultSetupStep.sceneName

    this.name = sceneName
    this._bottomMenu = new BottomMenu()
    this.titleLabel.text = this.config.title
    this._bottomMenu.setup((factory: ElementFactory) => {
      const elements: HTMLElement[] = []

      elements.push(factory.createButton('Back', this.onPreviousPage))
      elements.push(factory.createSpacer())
      elements.push(factory.createPrimaryButton('Next', this.onNextPage))

      return elements
    })

    this.config.images.forEach((image) => {
      if (image instanceof Actor) {
        this.imageContainer.addChild(image)
      } else {
        const sprite = image.toSprite()
        sprite.scale = vec(2, 2)
        this.imageContainer.graphics.use(sprite)
      }
    })
  }

  override onDeactivate(context: SceneActivationContext) {
    if (this._bottomMenu) {
      this._bottomMenu.teardown()
    }
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
      this.engine.goToScene('audioReport')
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