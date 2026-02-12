import { Sound } from "excalibur"

let registered = false

const PLAY = '▶️'
const STOP = '⏹️'
const ERROR = '‼️'
const template = `
  <style>
    .root {
      --selected-color: transparent;
      padding: 5px;
      border: 5px solid var(--selected-color);
      border-radius: 4em;
    }

    .root.selected {
      --selected-color: white;
    }

    .control {
      --primary-color: white;
      --secondary-color: oklch(from var(--primary-color) calc(l - 0.2) c h);

      transition: all;
      transition-duration: 0.2s;
      padding: 2em;
      border-radius: 2em;
      line-height: 0px;
      position: relative;
      cursor: pointer;
      background: linear-gradient(to bottom, var(--primary-color) 0%, var(--secondary-color) 100%);
      border: 2px solid var(--secondary-color);
    }

    .control:hover {
      background: linear-gradient(to bottom, var(--primary-color) 50%, var(--secondary-color) 100%);
    }

    .control:active {
      --primary-color: oklch(from white calc(l - 0.25) c h);
      --secondary-color: oklch(from white calc(l - 0.25) c h);
    }

    .control:disabled {
      pointer-events: none;
      opacity: 0.8;
    }

    .control span {
      position: absolute;
      font-size: 30px;
      line-height: 30px;
      top: 0.5em;
      left: 0.5em;
    }
  </style>
  <div class="root">
    <button class="control" title="Play clip">
      <span></span>
    </button>
  </div>
`

class PlayAudioComponentState {
  static EMPTY = 'empty'
  static READY = 'ready' 
  static PLAYING = 'playing'
}

export class PlayAudioComponent extends HTMLElement {
  private _file: Blob | Sound | null = null
  private _state: PlayAudioComponentState = PlayAudioComponentState.EMPTY
  private _selected: boolean = false
  private rootElement?: HTMLDivElement | null
  private playbackControl?: HTMLButtonElement | null
  private playbackLabel?: HTMLSpanElement | null

  get selected() { return this._selected }
  set selected(value: boolean) {
    this._selected = value
    this.update()
  }

  get file(): Blob | Sound | null {
    return this._file
  }

  set file(file: Blob | Sound | null) {
    this._file = file

    if (this._file) {
      this.state = PlayAudioComponentState.READY
    } else {
      this.state = PlayAudioComponentState.EMPTY
    }
  }

  get canPlay() { return this._state === PlayAudioComponentState.READY && !!this.file }
  get isPlaying() { return this._state === PlayAudioComponentState.PLAYING }
  get isEmpty() { return this._state === PlayAudioComponentState.EMPTY }

  set state(newState: PlayAudioComponentState) {
    this._state = newState
    this.update()
  }

  connectedCallback() {
    this.innerHTML = template

    this.rootElement = this.querySelector<HTMLDivElement>('.root')
    this.playbackControl = this.rootElement?.querySelector<HTMLButtonElement>('button.control')
    this.playbackLabel = this.playbackControl?.querySelector('span')

    if (this.playbackControl) this.playbackControl.addEventListener('click', this.onPlaybackClick)
    this.update()
  }

  disconnectedCallback() {
    if (this.playbackControl) this.playbackControl.removeEventListener('click', this.onPlaybackClick)
  }

  onPlaybackClick = (event: Event) => {
    if (this.file instanceof Sound) {
      this.file.play()
    } else if (this.file instanceof Blob) {
      // TODO
    }
  }

  private update = () => {
    if (!this.playbackControl || !this.playbackLabel) {
      return
    }

    switch(this._state) {
      case PlayAudioComponentState.EMPTY:
        this.playbackControl.disabled = true
        this.playbackLabel.innerText = ERROR
        break

      case PlayAudioComponentState.PLAYING:
        this.playbackControl.disabled = false
        this.playbackLabel.innerText = STOP
        break

      case PlayAudioComponentState.READY:
        this.playbackControl.disabled = false
        this.playbackLabel.innerText = PLAY
        break
    }

    if (this.selected) {
      this.rootElement?.classList.add('selected')
    } else {
      this.rootElement?.classList.remove('selected')
    }
  }
}

if (!registered && customElements) {
  registered = true
  customElements.define('play-audio', PlayAudioComponent)
}