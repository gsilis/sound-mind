import { Actor, Color, Engine, vec } from "excalibur";

const WIDTH = 10
const HEIGHT = 100

export class LevelWidget extends Actor {
  private _max: number = 0
  private _level: number = 0
  private _background: Actor
  private _bar: Actor

  set level(level: number) {
    this._level = level
  }

  constructor(max: number, color: Color) {
    super({
      width: WIDTH,
      height: HEIGHT
    })

    this._max = max
    this._background = new Actor({ width: WIDTH, height: HEIGHT, color: Color.Black, opacity: 0.4, name: 'BoostLevelBackground' })
    this._bar = new Actor({ width: WIDTH, height: HEIGHT, color, name: 'BoostLevelBar' })

    this._background.pos.y = HEIGHT / 2
    this._bar.pos.y = HEIGHT / 2
  }

  override onInitialize(engine: Engine): void {
    this.addChild(this._background)
    this.addChild(this._bar)
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    const percentage = this._level / this._max
    
    this._bar.scale = vec(1, percentage)
    this._bar.pos.y = (HEIGHT / 2) + ((HEIGHT / 2) - (this._bar.height / 2))
  }
}