import { Actor, ActorArgs, CircleCollider, ColliderComponent, CollisionType, Engine } from "excalibur";
import { ActorCreator } from "../utilities/actor-creator";
import { Resources } from "../resources";

export class Shot extends Actor {
  private _speed: number
  constructor(args: { speed: number } & ActorArgs) {
    const { height } = Resources.Shots
    const options = {
      ...args,
      name: 'shot',
      collisionType: CollisionType.Active
    }
    super(options)
    this._speed = args.speed
    this.addChild(ActorCreator.fromImage(Resources.Shots))
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed)
    this.pos.y -= (elapsed * this._speed)
  }
}