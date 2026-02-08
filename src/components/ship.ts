import { Actor, ActorArgs, CollisionType, Engine } from "excalibur";
import { ActorCreator } from "../utilities/actor-creator";
import { Resources } from "../resources";

export class Ship extends Actor {
  private _animationType: string
  private _age?: number
  private _speed: number

  constructor(args: ({ animationType: string, speed: number } & ActorArgs)) {
    const { width, height } = Resources.Ship

    // @ts-ignore
    super({ ...args, collisionType: CollisionType.Passive, width, height })
    this._animationType = args.animationType
    this._speed = args.speed
    // this.collider = new ColliderComponent(new CircleCollider({ radius: width / 2 }))
    this.addChild(ActorCreator.fromImage(Resources.Ship))
  }

  override onAdd(engine: Engine): void {
    this._age = 0
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    this._age = this._age || 0
    this._age += elapsed

    this.pos.y += (this._speed * elapsed)
  }
}