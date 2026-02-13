import { Actor, Color, Engine, ExcaliburGraphicsContext, Label, Scene, SceneActivationContext, Sound, vec } from "excalibur";
import { setupSteps, type SetupStep, defaultSetupStep } from "./setup-steps";
import { FONT_SUBHEAD } from "../fonts";
import { GradientBackground } from "../components/gradient-background";
import { ActorCreator } from "../utilities/actor-creator";
import { Resources } from "../resources";
import { GameColor } from "../game-color";
import { BottomMenu } from "../components/bottom-menu";
import { ElementFactory } from "../components/element-factory";
import { PlayAudioComponent } from "../components/play-audio-component";
import { CenterMenu, DIRECTION_HORIZONTAL } from "../components/center-menu";
import { LaunchRecordButton } from "../components/launch-record-button";
import { GameData } from "../game-data";
import { EnableMicrophoneDialog } from "../components/enable-microphone-dialog";
import { RecordAudioDialog } from "../components/record-audio-dialog";

const gameData = GameData.getInstance()

interface AudioSelectLevelData {
  sceneName: string
}

export class AudioSelectLevel extends Scene {
  private name: string = ''
  private titleLabel = gameData.titleLabelFactory.create('')
  private instructionsLabel = gameData.labelFactory.create('Select a sound effect or record your own.')
  private imageContainer: Actor = new Actor()
  private _background?: GradientBackground
  private _border = ActorCreator.fromImage(Resources.IconBox)
  private _headerBackground?: GradientBackground
  private _footerBackground?: GradientBackground
  private _bottomMenu?: BottomMenu
  private _centerMenu?: CenterMenu
  private _playDefaultAudio = new PlayAudioComponent()
  private _playRecordedAudio = new PlayAudioComponent()
  private _recordAudio = new LaunchRecordButton()
  private _recordedSound?: Sound
  private _selectedAudio?: Sound

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
  }

  override onActivate(context: SceneActivationContext<AudioSelectLevelData>): void {
    super.onActivate(context)
    let sceneName = context.data?.sceneName
    if (sceneName === undefined) sceneName = defaultSetupStep.sceneName

    this.add(this.titleLabel)
    this.add(this.imageContainer)
    this.name = sceneName
    this.titleLabel.text = this.config.title
    if (this._bottomMenu) this._bottomMenu.disabled = false
    if (this._centerMenu) this._centerMenu.disabled = false

    this._centerMenu = new CenterMenu({ direction: DIRECTION_HORIZONTAL })
    this._centerMenu.setup((factory: ElementFactory) => {
      const elements: HTMLElement[] = []

      elements.push(this._playDefaultAudio)
      elements.push(this._playRecordedAudio)
      elements.push(this._recordAudio)

      return elements
    })

    this._recordAudio.addEventListener('click', this.onRecord)
    this._bottomMenu = new BottomMenu()
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

    if (this.config.sound) {
      this._playDefaultAudio.file = this.config.sound
      this._selectedAudio = this._selectedAudio || this.config.sound
    }

    this.add(this.instructionsLabel)
  }

  override onDeactivate(context: SceneActivationContext) {
    super.onDeactivate(context)
    if (this._recordAudio) {
      this._recordAudio.removeEventListener('click', this.onRecord)
    }

    this.imageContainer.removeAllChildren()
    this.remove(this.titleLabel)
    this.remove(this.imageContainer)
    this.remove(this.instructionsLabel)
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
    this.instructionsLabel.pos.y = this.titleLabel.pos.y + 65
    this.instructionsLabel.pos.x = halfWidth - 140

    if (this._playRecordedAudio && this._recordedSound) {
      this._playRecordedAudio.style.display = 'auto'
    } else {
      this._playRecordedAudio.style.display = 'none'
    }

    this._selectedAudio && [this._playDefaultAudio, this._playRecordedAudio].forEach((component) => {
      component.selected = this._selectedAudio === component.file
    })
  }

  onNextPage = () => {
    if (this._bottomMenu) this._bottomMenu.teardown()
    if (this._centerMenu) this._centerMenu.teardown()
    if (this._centerMenu) this._centerMenu.disabled = true
    if (this._bottomMenu) this._bottomMenu.disabled = true

    if (this.hasNextPage) {
      const nextSceneName = this.nextPageConfig.sceneName
      this.engine.goToScene(nextSceneName, { sceneActivationData: { sceneName: nextSceneName } })
    } else {
      this.engine.goToScene('audioReport')
    }
  }

  onPreviousPage = () => {
    if (this._bottomMenu) this._bottomMenu.teardown()
    if (this._centerMenu) this._centerMenu.teardown()
    if (this._centerMenu) this._centerMenu.disabled = true
    if (this._bottomMenu) this._bottomMenu.disabled = true

    if (this.hasPrevPage) {
      const prevSceneName = this.prevPageConfig.sceneName
      this.engine.goToScene(prevSceneName, { sceneActivationData: { sceneName: prevSceneName } })
    } else {
      this.engine.goToScene('start')
    }
  }

  onRecord = () => {
    navigator.permissions.query({ name: 'microphone' }).then(async (status: PermissionStatus) => {
      if (status.state === 'granted' && !gameData.mediaStream) {
        this.showEnableModal(false)
      } else if (status.state === 'granted') {
        this.showRecordModal()
      } else if (status.state === 'denied') {
        this.showEnableModal(true)
      } else {
        this.showEnableModal(false)
      }
    }).catch(() => {})
  }

  onConfirmMicrophone = (event: Event) => {
    const custom = event as CustomEvent
    if (!event.target) return

    event.target.removeEventListener('cancel', this.onCancelMicrophone)
    event.target.removeEventListener('confirm', this.onConfirmMicrophone)

    gameData.mediaStream = custom.detail

    this.onRecord()
  }

  onCancelMicrophone = (event: Event) => {
    if (!event.target) return

    event.target.removeEventListener('cancel', this.onCancelMicrophone)
    event.target.removeEventListener('confirm', this.onConfirmMicrophone)
  }

  onCancelRecording = (event: Event) => {
    if (!event.target) return

    gameData.modal.show(null)
  }

  onSelectRecording = (event: Event) => {
    const custom = event as CustomEvent
    if (!event.target) return

    console.log('Selectd recording', event)
  }

  private showRecordModal = () => {
    const audioModal = new RecordAudioDialog()
    audioModal.addEventListener('cancel', this.onCancelRecording)
    audioModal.addEventListener('confirm', this.onSelectRecording)

    gameData.modal.show(audioModal)
  }

  private showEnableModal = (_showErrorState: boolean) => {
    const microphoneModal = new EnableMicrophoneDialog()
    microphoneModal.addEventListener('cancel', this.onCancelMicrophone)
    microphoneModal.addEventListener('confirm', this.onConfirmMicrophone)

    gameData.modal.show(microphoneModal)
  }
}