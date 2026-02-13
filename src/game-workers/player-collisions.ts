import { Collider, Scene } from "excalibur";
import { HEALTH_HIT, Player } from "../player";
import { GameData } from "../game-data";
import { Ship } from "../components/ship";

const gameData = GameData.getInstance()

export class PlayerCollisions {
  private scene: Scene

  constructor(scene: Scene, player: Player) {
    this.scene = scene
    player.onCollisionStart = this.onCollision
  }

  private onCollision(self: Collider, other: Collider) {
    const ship = other.owner as Ship
    const player = self.owner as Player

    if (ship.name === 'ship' && player.name === 'player' && !player.isInvincible) {
      gameData.hp = ship.damageToPlayer
      player.healthState = HEALTH_HIT
      gameData.sounds.damage.play()
    }
  }
}