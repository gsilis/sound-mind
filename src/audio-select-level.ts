import { Actor, Color, Engine, Label, Rectangle, Scene, SceneActivationContext } from "excalibur";
import { setupSteps, type SetupStep, defaultSetupStep } from "./setup-steps";
import { FONT_SUBHEAD } from "./fonts";
import { ControlStrip } from "./control-strip";

interface AudioSelectLevelData {
  sceneName: string
}

export class AudioSelectLevel extends Scene {
  private name: string = ''
  private titleLabel: Label = new Label({ font: FONT_SUBHEAD, color: Color.White })
  private imageContainer: Actor = new Actor()
  private controlStrip = new ControlStrip()

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

    this.titleLabel.text = this.config.title

    let maxWidth = 0
    let maxHeight = 0
    this.config.images.forEach(image => {
      const actor = new Actor({
        width: image.width,
        height: image.height,
      })

      actor.graphics.use(image.toSprite())
      this.imageContainer.addChild(actor)

      maxWidth = Math.max(maxWidth, image.width)
      maxHeight = Math.max(maxHeight, image.height)
    })

    const padding = 40;
    const borderWidth = maxWidth + padding
    const borderHeight = maxHeight + padding
    const border = new Actor({ width: borderWidth, height: borderHeight })
    border.graphics.use(new Rectangle({
      width: borderWidth,
      height: borderHeight,
      strokeColor: Color.White,
      lineWidth: 10,
      color: Color.Transparent,
    }))
    this.imageContainer.addChild(border)

    const container = document.querySelector('#container') as HTMLElement
    if (container) {
      this.controlStrip.setup(container, `audio-${this.config.sceneName}`)
      this.controlStrip.nextButton.innerText = this.hasNextPage ? 'Next' : 'Start!'
      this.controlStrip.nextButton.addEventListener('click', this.onNextPage)
      this.controlStrip.previousButton.innerText = this.hasPrevPage ? 'Back' : 'Exit'
      this.controlStrip.previousButton.addEventListener('click', this.onPreviousPage)
    }    
  }

  override onDeactivate(context: SceneActivationContext) {
    try {
      this.controlStrip.nextButton.removeEventListener('click', this.onNextPage)
      this.controlStrip.previousButton.removeEventListener('click', this.onPreviousPage)
      this.controlStrip.teardown()
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
    this.add(this.titleLabel)

    this.imageContainer.pos.x = halfWidth
    this.imageContainer.pos.y = 200
    this.add(this.imageContainer)
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