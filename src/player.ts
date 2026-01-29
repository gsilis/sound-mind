import { Actor, BoundingBox, Engine, Keys, vec } from "excalibur";
import { Resources } from "./resources";
import { Boost } from "./boost";

export class Player extends Actor {
  // Per second
  private _speed: number = (200 / 1000)
  private _boostSpeed: number = this._speed * 2
  private _boost: Boost = new Boost(2000, 0.1)
  private _isBoosting: boolean = false
  private _flame: Actor
  private _flameMoving: Actor
  private _flameBoost: Actor
  private _planeLeft: Actor
  private _planeRight: Actor
  private _moving: boolean = false
  private _bounds: BoundingBox

  get boostLevel(): number {
    return this._boost.balance
  }

  get boostMax(): number {
    return this._boost.max
  }

  constructor(bounds: BoundingBox) {
    super({
      name: 'Player',
      pos: vec(100, 100),
      width: 34,
      height: 64,
    })

    this._bounds = bounds
    this._flame = new Actor()
    this._flame.graphics.add(Resources.PlaneFlame.toSprite())
    this._flameMoving = new Actor()
    this._flameMoving.graphics.add(Resources.PlaneFlameMove.toSprite())
    this._flameBoost = new Actor()
    this._flameBoost.graphics.add(Resources.PlaneFlameBoost.toSprite())
    this._planeLeft = new Actor()
    this._planeLeft.graphics.add(Resources.PlaneLeft.toSprite())
    this._planeRight = new Actor()
    this._planeRight.graphics.add(Resources.PlaneRight.toSprite())

    this.addChild(this._flame)
  }

  override onInitialize(engine: Engine): void {
    this.graphics.add(Resources.Plane.toSprite())
    this._flame.graphics.opacity = 0.6
    this._flameMoving.actions.repeatForever((c) => {
      c.fade(0.7, 200)
      c.fade(1, 200)
    })
    this._flameBoost.actions.repeatForever((c) => {
      c.fade(0.8, 100)
      c.fade(1, 100)
    })
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    const keyboard = engine.input.keyboard
    const up = keyboard.isHeld(Keys.W) || keyboard.isHeld(Keys.Up)
    const down = keyboard.isHeld(Keys.S) || keyboard.isHeld(Keys.Down)
    const left = keyboard.isHeld(Keys.A) || keyboard.isHeld(Keys.Left)
    const right = keyboard.isHeld(Keys.D) || keyboard.isHeld(Keys.Right)
    const shift = keyboard.isHeld(Keys.ShiftLeft)
    const move = this._speed * elapsed
    const boostMove = this._boostSpeed * elapsed
    const hasLeft = this.hasChild(this._planeLeft)
    const hasRight = this.hasChild(this._planeRight)

    this._moving = up || down || left || right

    if (shift && this._boost.availableFor(elapsed)) {
      this._isBoosting = true
    } else {
      this._isBoosting = false
    }

    if (this._isBoosting && this._moving) {
      this._boost.spend(elapsed)
    } else {
      this._boost.tick(elapsed)
    }
    const moveAmount = this._isBoosting ? boostMove : move
    if (up) {
      this.pos.y -= moveAmount
      this.pos.y = Math.max(this.pos.y, this._bounds.top)
    } else if (down) {
      this.pos.y += moveAmount
      this.pos.y = Math.min(this.pos.y, this._bounds.bottom)
    }

    if (left) {
      this.pos.x -= moveAmount
      this.pos.x = Math.max(this.pos.x, this._bounds.left)
      !hasLeft && this.addChild(this._planeLeft)
      hasRight && this.removeChild(this._planeRight)
    } else if (right) {
      this.pos.x += moveAmount
      this.pos.x = Math.min(this.pos.x, this._bounds.right)
      !hasRight && this.addChild(this._planeRight)
      hasLeft && this.removeChild(this._planeLeft)
    } else {
      hasLeft && this.removeChild(this._planeLeft)
      hasRight && this.removeChild(this._planeRight)
    }

    const boost = this._moving && this._isBoosting
    const moving = !this._isBoosting && this._moving
    const flamePresent = this.hasChild(this._flame)
    const movePresent = this.hasChild(this._flameMoving)
    const boostPresent = this.hasChild(this._flameBoost)

    if (boost) {
      !boostPresent && this.addChild(this._flameBoost)
      this.removeChild(this._flame)
      this.removeChild(this._flameMoving)
    } else if (moving) {
      !movePresent && this.addChild(this._flameMoving)
      this.removeChild(this._flame)
      this.removeChild(this._flameBoost)
    } else {
      !flamePresent && this.addChild(this._flame)
      this.removeChild(this._flameMoving)
      this.removeChild(this._flameBoost)
    }
  }
}