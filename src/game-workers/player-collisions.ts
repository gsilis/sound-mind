import { Collider, Scene } from "excalibur";
import { Player } from "../player";

export class PlayerCollisions {
  private scene: Scene
  private player: Player

  constructor(scene: Scene, player: Player) {
    this.scene = scene
    this.player = player
    this.player.onCollisionStart = this.onCollision
  }

  private onCollision(self: Collider, other: Collider) {
    const name = other.owner.name

    if (name === 'ship') {
      console.log('GAME OVER')
    }
  }
}