import { Actor, ActorArgs, Engine } from "excalibur"
import { ActorCreator } from "../utilities/actor-creator"
import { Resources } from "../resources"
import { TemporaryActor } from "../interfaces/temporary-actor"

export class Hit extends Actor implements TemporaryActor {
  private _complete = false

  get complete() { return this._complete }

  constructor(args: ActorArgs = {}) {
    super({ ...args, name: 'hit' })
  }

  override onInitialize(_engine: Engine): void {
    this.addChild(ActorCreator.fromImage(Resources.Hit))
  }

  override onAdd(_engine: Engine): void {
    this.actions.delay(100).toPromise().then(() => {
      this._complete = true
    })
  }

  override onRemove(_engine: Engine): void {
    if (!this._complete) this._complete = true 
  }
}