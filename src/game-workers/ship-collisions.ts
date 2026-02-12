import { Collider, Scene } from "excalibur";
import { Ship } from "../components/ship";
import { GameData } from "../game-data";
import { TemporaryItemManager } from "../components/temporary-item-manager";
import { Explosion } from "../components/explosion";
import { Hit } from "../components/hit";
import { Shot } from "../components/shot";

const gameData = GameData.getInstance()

export class ShipCollisions {
  private ships: Ship[] = []
  private scene: Scene
  private explosionManager: TemporaryItemManager<Explosion>
  private hitManager: TemporaryItemManager<Hit>

  constructor(scene: Scene, explosionManager: TemporaryItemManager<Explosion>, hitManager: TemporaryItemManager<Hit>) {
    this.scene = scene
    this.hitManager = hitManager
    this.explosionManager = explosionManager
  }

  add(ship: Ship) {
    this.ships.push(ship)

    ship.onCollisionStart = this.onCollision.bind(this)
    ship.onRemove = () => {
      this.onRemove(ship)
    }
  }

  private onCollision(self: Collider, other: Collider) {
    const shot = other.owner as Shot
    const ship = self.owner as Ship

    if (shot.name === 'shot' && ship.name === 'ship') {
      ship.hp -= 1
      this.hitManager.createAt(shot)
      this.scene.remove(shot)
      
      if (ship.hp === 0) {
        this.explosionManager.createAt(ship)
        gameData.sounds.explode.play()
        this.scene.remove(shot)
        this.scene.remove(ship)
      }
    }
  }

  private onRemove(ship: Ship) {
    const index = this.ships.indexOf(ship)

    if (index > -1) {
      this.ships.splice(index, 1)
    }
  }
}