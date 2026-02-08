import { Actor, CollisionType, Engine, vec } from "excalibur";
import { Resources } from "./resources";
import { GameData } from "./game-data";

const gameData = GameData.getInstance()

export const MOVE_STRAIGHT = 'straight'
export const MOVE_LEFT = 'left'
export const MOVE_RIGHT = 'right'
export const FLY_IDLE = 'normal'
export const FLY_STANDARD = 'standard'
export const FLY_BOOST = 'boost'
export const HEALTH_NORMAL = 'healthy'
export const HEALTH_HIT = 'hit'

type MoveStateType = typeof MOVE_STRAIGHT | typeof MOVE_LEFT | typeof MOVE_RIGHT
type FlyStateType = typeof FLY_IDLE | typeof FLY_STANDARD | typeof FLY_BOOST
type HealthStateType = typeof HEALTH_NORMAL | typeof HEALTH_HIT

export class Player extends Actor {
  // Per second
  private _flame: Actor
  private _flameMoving: Actor
  private _flameBoost: Actor
  private _planeLeft: Actor
  private _planeRight: Actor
  private _moveState: MoveStateType = MOVE_STRAIGHT
  private _flyState: FlyStateType = FLY_IDLE
  private _healthState: HealthStateType = HEALTH_NORMAL

  get moveState() { return this._moveState }
  set moveState(value: MoveStateType) { this._moveState = value }
  get flyState() { return this._flyState }
  set flyState(value: FlyStateType) { this._flyState = value }
  get isInvincible() { return this._healthState === HEALTH_HIT }
  get healthState() { return this._healthState }
  set healthState(value: HealthStateType) {
    if (value === HEALTH_HIT) {
      this.actions.blink(50, 50, 20).toPromise().then(() => {
        this._healthState = HEALTH_NORMAL
      })
    }

    this._healthState = value
  }

  constructor() {
    super({
      name: 'player',
      pos: vec(100, 100),
      width: 34,
      height: 64,
      collisionType: CollisionType.Passive,
    })

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
    if (!gameData.running) return

    const hasLeft = this.hasChild(this._planeLeft)
    const hasRight = this.hasChild(this._planeRight)
    const hasBoost = this.hasChild(this._flameBoost)
    const hasIdle = this.hasChild(this._flame)
    const hasMoving = this.hasChild(this._flameMoving)

    switch (this._flyState) {
      case FLY_BOOST:
        !hasBoost && this.addChild(this._flameBoost)
        hasIdle && this.removeChild(this._flame)
        hasMoving && this.removeChild(this._flameMoving)
        break

      case FLY_STANDARD:
        !hasMoving && this.addChild(this._flameMoving)
        hasIdle && this.removeChild(this._flame)
        hasBoost && this.removeChild(this._flameBoost)
        break

      case FLY_IDLE:
        !hasIdle && this.addChild(this._flame)
        hasMoving && this.removeChild(this._flameMoving)
        hasBoost && this.removeChild(this._flameBoost)
        break
    }

    switch (this._moveState) {
      case MOVE_LEFT:
        !hasLeft && this.addChild(this._planeLeft)
        hasRight && this.removeChild(this._planeRight)
        break

      case MOVE_RIGHT:
        !hasRight && this.addChild(this._planeRight)
        hasLeft && this.removeChild(this._planeLeft)
        break

      case MOVE_STRAIGHT:
        hasLeft && this.removeChild(this._planeLeft)
        hasRight && this.removeChild(this._planeRight)
        break
    }
  }
}