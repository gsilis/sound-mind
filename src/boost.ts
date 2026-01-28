import { Delay } from "./delay"

export class Boost {
  private _max: number
  private _rate: number
  private _balance: number
  private _delay: Delay
  private _recharge: boolean = true

  get balance(): number {
    return this._balance
  }

  get max(): number {
    return this._max
  }

  constructor(max: number, refreshRate: number) {
    this._max = max
    this._balance = max
    this._rate = refreshRate
    this._delay = new Delay(2000)
    this._delay.addListener(() => {
      this._recharge = true
    })
  }

  availableFor(time: number): boolean {
    return (this._balance - time) >= 0
  }

  spend(time: number) {
    this._balance = Math.max(this._balance - time, 0)
    this._recharge = false
    this._delay.reset()
  }

  tick(elapsed: number) {
    this._delay.advance(elapsed)
    if (this._recharge && this._balance < this._max) {
      this._balance = Math.min(this._max, this._balance += (elapsed * this._rate))
    }
  }
}