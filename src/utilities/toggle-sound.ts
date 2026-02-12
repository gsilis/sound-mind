import { Sound } from "excalibur";

export class ToggleSound {
  private _sound: Sound
  private _playing = false

  get playing() { return this._playing }
  set playing(val: boolean) {
    this._playing = val

    if (val) {
      if (!this._sound.isPlaying()) this._sound.play().then(this.onComplete)
    } else {
      if (this._sound.isPlaying()) this._sound.stop()
    }
  }

  constructor(sound: Sound) {
    this._sound = sound
  }

  private onComplete = () => {
    if (this._playing) {
      this._sound.play().then(this.onComplete)
    }
  }
}