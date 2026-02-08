import { Collider, Scene } from "excalibur";
import { HEALTH_HIT, Player } from "../player";
import { GameData } from "../game-data";

const gameData = GameData.getInstance()

export class PlayerCollisions {
  private scene: Scene

  constructor(scene: Scene, player: Player) {
    this.scene = scene
    player.onCollisionStart = this.onCollision
  }

  private onCollision(self: Collider, other: Collider) {
    const name = other.owner.name
    const player = self.owner as Player

    if (name === 'ship' && player.name === 'player' && !player.isInvincible) {
      gameData.hp = -10
      player.healthState = HEALTH_HIT
    }
  }
}