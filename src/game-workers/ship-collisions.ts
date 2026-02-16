import { Actor, Collider, Scene } from "excalibur";
import { GameData } from "../game-data";
import { TemporaryItemManager } from "../components/temporary-item-manager";
import { Explosion } from "../components/explosion";
import { Hit } from "../components/hit";
import { Shot } from "../components/shot";
import { SpeedObject } from "../interfaces/speed-object";
import { DestroyValue } from "../interfaces/destroy-value";

const gameData = GameData.getInstance()

export class ShipCollisions {
  private objects: (SpeedObject & Actor)[] = []
  private scene: Scene
  private explosionManager: TemporaryItemManager<Explosion>
  private hitManager: TemporaryItemManager<Hit>

  constructor(scene: Scene, explosionManager: TemporaryItemManager<Explosion>, hitManager: TemporaryItemManager<Hit>) {
    this.scene = scene
    this.hitManager = hitManager
    this.explosionManager = explosionManager
  }

  add(object: (SpeedObject & Actor)) {
    this.objects.push(object)

    object.onCollisionStart = this.onCollision.bind(this)
    object.onRemove = () => {
      this.onRemove(object)
    }
  }

  private onCollision(self: Collider, other: Collider) {
    const shot = other.owner as Shot
    const ship = self.owner as (SpeedObject & Actor)
    const damageableObject = self.owner as unknown as DestroyValue

    if (shot.name === 'shot' && ship.name === 'ship') {
      damageableObject.damageBy(shot.damage)
      this.hitManager.createAt(shot)
      this.scene.remove(shot)

      if (damageableObject.hp === 0) {
        this.explosionManager.createAt(ship)
        gameData.sounds.explode.play()
        gameData.score += damageableObject.destroyValue
        this.scene.remove(shot)
        this.scene.remove(ship)
      }
    }
  }

  private onRemove(object: (SpeedObject & Actor)) {
    const index = this.objects.indexOf(object)

    if (index > -1) {
      this.objects.splice(index, 1)
    }
  }
}