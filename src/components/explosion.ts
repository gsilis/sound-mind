import { Actor, Animation, AnimationStrategy, Engine, SpriteSheet } from "excalibur";
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

export class Explosion extends Actor implements TemporaryActor {
  private _complete = false
  private _animation?: Animation

  get complete() { return this._complete }
  set complete(value: boolean) {
    this._complete = value
  }

  override onInitialize(_engine: Engine): void {
    this._animation = Animation.fromSpriteSheet(sprite, [0, 1, 2, 3, 4, 5, 6, 7], 50, AnimationStrategy.End)
  }

  override onAdd(_engine: Engine): void {
    if (this._animation) {
      this.graphics.use(this._animation)
      this._animation.play()
    }

    this.actions.delay(500).toPromise().then(() => {
      this._complete = true
      this.graphics.opacity = 0
    })
  }

  override onRemove(_engine: Engine): void {
    if (!this._complete) this._complete = true
  }
}