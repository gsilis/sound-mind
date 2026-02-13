import { Engine, Scene } from "excalibur";
import { GameData } from "../game-data";
import { Ship } from "../components/ship";

const gameData = GameData.getInstance()

export class ShipMovingManager {
  private containerScene: Scene

  constructor(scene: Scene) {
    this.containerScene = scene
  }

  update(engine: Engine, elapsed: number) {
    const actors = this.containerScene.actors.filter(actor => actor.name === 'ship')

    actors.forEach((actor) => {
      const ship = actor as unknown as Ship
      if (!gameData.running) return

      ship.age += elapsed

      ship.pos.y += (ship.speed * elapsed)
    })
  }
}