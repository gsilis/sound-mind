import { Actor, Engine } from "excalibur";
import { SpeedObject } from "../interfaces/speed-object";
import { ActorCreator } from "../utilities/actor-creator";
import { Resources } from "../resources";

export class Ammo extends Actor implements SpeedObject {
  private icon = ActorCreator.fromImage(Resources.Ammo)

  get speed() { return 30 / 1000 }
  get speedObjectType() { return 'ammo' }
  get effectValue() { return 100 }

  override onAdd(engine: Engine) {
    super.onAdd(engine)
    this.addChild(this.icon)
  }

  override onRemove(engine: Engine): void {
    super.onRemove(engine)
    this.removeChild(this.icon)
  }
}