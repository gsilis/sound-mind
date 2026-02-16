import { Actor, ActorArgs, CollisionType, Engine } from "excalibur";
import { ActorCreator } from "../utilities/actor-creator";
import { Resources } from "../resources";
import { DamageCauser } from "../interfaces/damage-causer";
import { DestroyValue } from "../interfaces/destroy-value";

export class Ship extends Actor implements DamageCauser, DestroyValue {
  private _age: number = 0
  private _speed: number
  private _hp: number

  get damageToPlayer() { return -20 }
  get destroyValue() { return 5 }
  get hp() { return this._hp }
  get speed() { return this._speed }
  get age() { return this._age }
  set age(val: number) { this._age = val }

  damageBy = (amount: number) => {
    this._hp = Math.max(this._hp - amount, 0)
  }

  constructor(args: ({ speed: number, hp: number } & ActorArgs)) {
    const { width, height } = Resources.Ship

    // @ts-ignore
    super({ ...args, collisionType: CollisionType.Passive, width, height, name: 'ship' })
    this._hp = args.hp
    this._speed = args.speed
    // this.collider = new ColliderComponent(new CircleCollider({ radius: width / 2 }))
    this.addChild(ActorCreator.fromImage(Resources.Ship))
  }

  override onAdd(engine: Engine): void {
    this._age = 0
  }
}