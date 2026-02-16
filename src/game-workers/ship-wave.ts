import { Wave } from "../scenes/waves"

export type CompleteCallback = () => void
export type EmitCallback = (positions: string) => void

export class ShipWave {
  private _emissions = 0
  private _speed: number
  private _speedMs: number
  private _position: number
  private _data: string[] = []
  private _complete: CompleteCallback
  private _emit: EmitCallback

  constructor(wave: Wave, emit: EmitCallback, complete: CompleteCallback) {
    this._data = [...wave.data]
    this._speed = wave.speed
    this._speedMs = this._speed / 1000
    this._position = 0
    this._complete = complete
    this._emit = emit
  }

  update(timeElapsed: number) {
    const distance = timeElapsed * this._speedMs
    this._position += distance

    if (this._position >= 32 || this._emissions === 0) {
      this._position = Math.max(0, this._position % 32)

      const row = this._data.pop()
      if (row) {
        this._emissions += 1
        this._emit(row)
      } else {
        debugger
        this._complete()
      }
    }
  }
}