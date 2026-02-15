import { Sound } from "excalibur"
import { CounterComponent } from "./counter-component"
import { SoundVisualizerComponent } from "./sound-visualizer-component"
import { GameData } from "../game-data"
import { PlayAudioComponent } from "./play-audio-component"

const gameData = GameData.getInstance()
const audioContext = new AudioContext()

export class RecordAudioDialog extends HTMLElement {
  static TEMPLATE_NAME = 'template#record-audio'

  private _dialog?: HTMLDialogElement | null
  private _cancelButton?: HTMLButtonElement | null
  private _confirmButton?: HTMLButtonElement | null
  private _recordAudioButton?: HTMLButtonElement | null
  private _playAudioButton?: HTMLButtonElement | null
  private _timerComponent?: CounterComponent | null
  private _soundVisualizer?: SoundVisualizerComponent | null
  private _clip?: Sound | null
  private _recorder?: MediaRecorder

  constructor() {
    super()
    this.classList.add('dialog-container')
  }

  connectedCallback() {
    const template = document.querySelector<HTMLTemplateElement>(RecordAudioDialog.TEMPLATE_NAME)

    if (!template) {
      throw new Error(`Template with selector '${RecordAudioDialog.TEMPLATE_NAME}' is missing from the DOM.`)
    }

    this.innerHTML = template.innerHTML

    this._dialog = this.querySelector('dialog')
    this._cancelButton = this._dialog?.querySelector('button.cancel-dialog')
    this._confirmButton = this._dialog?.querySelector('button.confirm-dialog')
    this._recordAudioButton = this._dialog?.querySelector('button.record-audio')
    this._playAudioButton = this._dialog?.querySelector('button.play-audio')
    this._timerComponent = this._dialog?.querySelector('counter-component')
    this._soundVisualizer = this._dialog?.querySelector('sound-visualizer-component')

    if (this._cancelButton) this._cancelButton.addEventListener('click', this.onCancel)
    if (this._confirmButton) this._confirmButton.addEventListener('click', this.onConfirm)
    if (this._recordAudioButton) {
      this._recordAudioButton.addEventListener('mousedown', this.onPress)
      this._recordAudioButton.addEventListener('mouseup', this.onRelease)
    }
    if (this._playAudioButton) {
      this._playAudioButton.addEventListener('click', this.onPlayAudio)
    }

    this._recorder = gameData.recorderFactory.create()
    this._recorder.addEventListener('start', this.onRecorderStart)
    this._recorder.addEventListener('stop', this.onRecorderStop)
    this._recorder.addEventListener('dataavailable', this.onRecordClip)
  }

  disconnectedCallback() {
    if (this._cancelButton) this._cancelButton.removeEventListener('click', this.onCancel)
    if (this._confirmButton) this._confirmButton.removeEventListener('click', this.onConfirm)
    
    if (this._recorder) {
      this._recorder.removeEventListener('start', this.onRecorderStart)
      this._recorder.removeEventListener('stop', this.onRecorderStop)
      this._recorder.removeEventListener('dataavailable', this.onRecordClip)
    }
  }

  onConfirm = () => {
    this.dispatchEvent(new CustomEvent('confirm', { detail: this._clip }))
  }

  onCancel = () => {
    this.dispatchEvent(new Event('cancel'))
  }

  hideElement = (possibleElement?: HTMLElement | null) => {
    if (possibleElement) possibleElement.style.display = 'none'
  }

  showElement = (possibleElement?: HTMLElement | null) => {
    if (possibleElement) possibleElement.style.display = 'auto'
  }

  onPress = () => {
    if (this._recorder) {
      this._recorder.start()
    }
  }

  onRelease = () => {
    this.playerToggle(false)
    
    if (this._recorder) {
      this._recorder.stop()
    }
  }

  playerToggle = (enabled: boolean) => {
    if (this._recordAudioButton) this._recordAudioButton.disabled = !enabled
    if (this._playAudioButton) this._playAudioButton.disabled = !enabled
  }

  onRecorderStart = () => {
    if (this._timerComponent) {
      this._timerComponent.setAttribute('run', 'true')
    }
  }

  onRecorderStop = () => {
    if (this._timerComponent) {
      this._timerComponent.setAttribute('run', '')
    }
  }

  onRecordClip = async (event: BlobEvent) => {
    const blob = event.data

    if (blob) {
      const buffer = await blob.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(buffer)

      this._clip = new Sound()
      this._clip.data = audioBuffer
      /**
       * Setting this because the engine does not allow
       * creating audio with a buffer
       */
      // @ts-ignore
      this._clip._duration = this._clip.data.duration
    } else {
      this._clip = null
    }

    this.playerToggle(true)
  }

  onPlayAudio = async () => {
    if (this._clip) {
      this._clip.play()
    }
  }
}

if (customElements && !customElements.get('record-audio-dialog')) {
  customElements.define('record-audio-dialog', RecordAudioDialog)
}