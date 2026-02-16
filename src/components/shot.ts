import { Actor, ActorArgs, CollisionType, Engine } from "excalibur";
import { ActorCreator } from "../utilities/actor-creator";
import { Resources } from "../resources";
import { GameData } from "../game-data";

const gameData = GameData.getInstance()

export class Shot extends Actor {
  private _speed: number
  private _damage: number
  constructor(args: { speed: number, damage: number } & ActorArgs) {
    const { height, width } = Resources.Shots
    super({
      ...args,
      name: 'shot',
      collisionType: CollisionType.Passive,
      // @ts-ignore -- Not sure why this isn't working yet
      width,
      // @ts-ignore
      height,
    })
    this._speed = args.speed
    this._damage = args.damage
    this.addChild(ActorCreator.fromImage(Resources.Shots))
  }

  get damage() { return this._damage }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    if (!gameData.running) return
    super.onPreUpdate(engine, elapsed)
    this.pos.y -= (elapsed * this._speed)

    if (this.pos.y < -32) {
      this.parent?.removeChild(this)
    }
  }
}