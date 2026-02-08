import { Collider, Scene } from "excalibur";
import { Ship } from "../components/ship";
import { GameData } from "../game-data";

const gameData = GameData.getInstance()

export class ShipCollisions {
  private ships: Ship[] = []
  private scene: Scene

  constructor(scene: Scene) {
    this.scene = scene
  }

  add(ship: Ship) {
    this.ships.push(ship)

    ship.onCollisionStart = this.onCollision.bind(this)
    ship.onRemove = () => {
      this.onRemove(ship)
    }
  }

  private onCollision(self: Collider, other: Collider) {
    const name = other.owner.name
    const ship = self.owner as Ship

    if (name === 'shot') {
      this.scene.remove(other.owner)
      this.scene.remove(self.owner)

      if (ship.name === 'ship') {
        gameData.score = ship.destroyValue
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