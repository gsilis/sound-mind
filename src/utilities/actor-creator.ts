import { Actor, ActorArgs, ImageSource } from "excalibur"

export class ActorCreator {
  static fromImage(image: ImageSource, opts: ActorArgs = {}): Actor {
    const combined = { ...opts, width: image.width, height: image.height }
    const actor = new Actor(combined as ActorArgs)
    actor.graphics.use(image.toSprite())

    return actor
  }
}