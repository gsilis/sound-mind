import { Actor, Engine } from "excalibur";
import { SpeedObject } from "../interfaces/speed-object";
import { ActorCreator } from "../utilities/actor-creator";
import { Resources } from "../resources";

export class Fuel extends Actor implements SpeedObject {
  private icon = ActorCreator.fromImage(Resources.Fuel)

  get speed() { return 30 / 1000 }
  get speedObjectType() { return 'fuel' }
  get effectValue() { return 500 }

  onAdd(engine: Engine): void {
    super.onAdd(engine)
    this.addChild(this.icon)
  }

  onRemove(engine: Engine): void {
    super.onRemove(engine)
    this.removeChild(this.icon)
  }
}