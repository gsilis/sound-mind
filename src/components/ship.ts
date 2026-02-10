import { Actor, ActorArgs, CollisionType, Engine } from "excalibur";
import { ActorCreator } from "../utilities/actor-creator";
import { Resources } from "../resources";
import { GameData } from "../game-data";
import { DamageCauser } from "../interfaces/damage-causer";
import { DestroyValue } from "../interfaces/destroy-value";

const gameData = GameData.getInstance()

export class Ship extends Actor implements DamageCauser, DestroyValue {
  private _animationType: string
  private _age?: number
  private _speed: number
  private _hp: number

  get damageToPlayer() { return -100 }
  get destroyValue() { return 5 }
  get hp() { return this._hp }
  set hp(value: number) {
    this._hp = Math.max(this._hp - 1, 0)
  }

  constructor(args: ({ animationType: string, speed: number, hp: number } & ActorArgs)) {
    const { width, height } = Resources.Ship

    // @ts-ignore
    super({ ...args, collisionType: CollisionType.Passive, width, height })
    this._hp = args.hp
    this._animationType = args.animationType
    this._speed = args.speed
    // this.collider = new ColliderComponent(new CircleCollider({ radius: width / 2 }))
    this.addChild(ActorCreator.fromImage(Resources.Ship))
  }

  override onAdd(engine: Engine): void {
    this._age = 0
  }

  override onPreUpdate(engine: Engine, elapsed: number): void {
    if (!gameData.running) return

    this._age = this._age || 0
    this._age += elapsed

    this.pos.y += (this._speed * elapsed)
  }
}