export class Delay {
  private _listeners: (() => void)[] = []
  private _duration: number
  private _current: number

  constructor(duration: number) {
    this._duration = duration
    this._current = 0
  }

  addListener(handler: () => void) {
    this._listeners.push(handler)
  }

  advance(time: number) {
    if (this._current >= this._duration) {
      return
    }

    this._current = Math.min(this._duration, this._current + time)

    if (this._current >= this._duration) {
      this._listeners.forEach(l => {
        try {
          l.apply(undefined)
        } catch (err) {}
      })
    }
  }

  reset() {
    this._current = 0
  }
}