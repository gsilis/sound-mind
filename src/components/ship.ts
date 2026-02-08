import { Actor, ActorArgs, CollisionType, Engine } from "excalibur";
import { ActorCreator } from "../utilities/actor-creator";
import { Resources } from "../resources";
import { GameData } from "../game-data";
import { DamageCauser } from "../interfaces/damage-causer";

const gameData = GameData.getInstance()

export class Ship extends Actor implements DamageCauser {
  private _animationType: string
  private _age?: number
  private _speed: number

  get damageToPlayer() { return -100 }

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
    if (!gameData.running) return

    this._age = this._age || 0
    this._age += elapsed

    this.pos.y += (this._speed * elapsed)
  }
}