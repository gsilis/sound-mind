import { Ammo } from "./ammo";
import { Fuel } from "./fuel";

export class DropFactory {
  createAmmo(x: number, y: number) {
    const obj = new Ammo({ width: 32, height: 32 })
    obj.pos.x = x
    obj.pos.y = y

    return obj
  }

  createFuel(x: number, y: number) {
    const obj = new Fuel({ width: 32, height: 32 })
    obj.pos.x = x
    obj.pos.y = y

    return obj
  }
}