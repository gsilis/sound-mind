import { Actor } from "excalibur";
import { Shot } from "./shot";

export class ShotFactory {
  create(x: number, y: number): Actor {
    const shot = new Shot({ speed: 200 / 1000, x, y })

    return shot
  }
}