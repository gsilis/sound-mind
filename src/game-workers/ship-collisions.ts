import { Collider, Scene } from "excalibur";
import { Ship } from "../components/ship";

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

    if (name === 'shot') {
      this.scene.remove(other.owner)
      this.scene.remove(self.owner)
    }
  }

  private onRemove(ship: Ship) {
    const index = this.ships.indexOf(ship)

    if (index > -1) {
      this.ships.splice(index, 1)
    }
  }
}