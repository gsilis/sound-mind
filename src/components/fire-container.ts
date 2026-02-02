import { Actor, ActorArgs, Engine } from "excalibur";
import { ShotFactory } from "./shot-factory";

export class FireContainer extends Actor {
  private _shotFactory: ShotFactory

  constructor(args: { factory: ShotFactory } & ActorArgs) {
    super(args)
    this._shotFactory = args.factory
  }

  addShot(x: number, y: number) {
    const shot = this._shotFactory.create(x, y)
    this.addChild(shot)
  }

  onPreUpdate(engine: Engine, elapsed: number): void {
    [...this.children].forEach((possibleShot) => {
      const actor = possibleShot as Actor
      actor.pos.setTo(actor.pos.x, actor.pos.y - 5)

      if (actor.pos.y < 5) {
        this.removeChild(possibleShot)
      }
    })
  }
}