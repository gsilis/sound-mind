import { Actor, ActorArgs, Animation, AnimationStrategy, Engine, SpriteSheet } from "excalibur";
import { Resources } from "../resources";
import { TemporaryActor } from "../interfaces/temporary-actor";

const sprite = SpriteSheet.fromImageSource({
  image: Resources.Explosion,
  grid: {
    rows: 1,
    columns: 8,
    spriteHeight: 32,
    spriteWidth: 32,
  }
})

type ConstructorArgs = {
  loop?: boolean
} & ActorArgs

export class Explosion extends Actor implements TemporaryActor {
  private _loop
  private _complete = false
  private _animation?: Animation

  constructor({ loop = false, ...restArgs }: ConstructorArgs = {}) {
    super(restArgs)

    this._loop = loop
  }

  get complete() { return this._complete }
  set complete(value: boolean) {
    this._complete = value
  }

  override onInitialize(_engine: Engine): void {
    const strategy = this._loop ? AnimationStrategy.Loop : AnimationStrategy.End
    this._animation = Animation.fromSpriteSheet(sprite, [0, 1, 2, 3, 4, 5, 6, 7], 50, strategy)
  }

  override onAdd(_engine: Engine): void {
    if (this._animation) {
      this.graphics.use(this._animation)
      this._animation.play()
    }

    if (this._loop) return
    this.actions.delay(500).toPromise().then(() => {
      this._complete = true
    })
  }

  override onRemove(_engine: Engine): void {
    if (!this._complete) this._complete = true
  }
}