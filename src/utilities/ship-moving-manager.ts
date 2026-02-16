import { Engine, Scene } from "excalibur";
import { GameData } from "../game-data";
import { Ship } from "../components/ship";
import { SpeedObject } from "../interfaces/speed-object";

const gameData = GameData.getInstance()

export class ShipMovingManager {
  private containerScene: Scene

  constructor(scene: Scene) {
    this.containerScene = scene
  }

  update(engine: Engine, elapsed: number) {
    const actors = this.containerScene.actors.filter((actor) => {
      const speedObject = actor as unknown as SpeedObject

      return speedObject && speedObject.speedObjectType !== undefined
    })

    actors.forEach((actor) => {
      const ship = actor as unknown as Ship
      if (!gameData.running) return

      ship.age += elapsed

      ship.pos.y += (ship.speed * elapsed)
      
      if (ship.pos.y > engine.screen.height + 32) {
        this.containerScene.remove(ship)
      }
    })
  }
}