import { Actor, ImageSource } from "excalibur"

export class ActorCreator {
  static fromImage(image: ImageSource): Actor {
    const actor = new Actor({ width: image.width, height: image.height })
    actor.graphics.use(image.toSprite())

    return actor
  }
}