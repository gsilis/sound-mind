import { Actor } from "excalibur";
import { Resources } from "../resources";
import { ActorCreator } from "../utilities/actor-creator";

export class ShotFactory {
  create(x: number, y: number): Actor {
    const shot = ActorCreator.fromImage(Resources.Shots)
    shot.pos.setTo(x, y)
    shot.name = 'shot'

    return shot
  }
}