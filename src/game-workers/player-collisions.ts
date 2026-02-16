import { Collider, Scene } from "excalibur";
import { HEALTH_HIT, Player } from "../player";
import { GameData } from "../game-data";
import { Ship } from "../components/ship";
import { SpeedObject } from "../interfaces/speed-object";

const gameData = GameData.getInstance()

export class PlayerCollisions {
  private scene: Scene

  constructor(scene: Scene, player: Player) {
    this.scene = scene
    player.onCollisionStart = this.onCollision
  }

  private onCollision(self: Collider, other: Collider) {
    const ship = other.owner as Ship
    const possibleDrop = other.owner as unknown as SpeedObject
    const player = self.owner as Player

    if (ship.name === 'ship' && player.name === 'player' && !player.isInvincible) {
      gameData.hp = ship.damageToPlayer
      player.healthState = HEALTH_HIT
      gameData.sounds.damage.play()
    } else if (possibleDrop.speedObjectType === 'ammo') {
      this.scene.remove(other.owner)
      gameData.shots += possibleDrop.effectValue
    } else if (possibleDrop.speedObjectType === 'fuel') {
      this.scene.remove(other.owner)
      gameData.boost.earn(possibleDrop.effectValue)
    }
  }
}