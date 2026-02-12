import { Engine, Scene } from "excalibur";
import { GameData } from "../game-data";
import { Ship } from "../components/ship";

const gameData = GameData.getInstance()

export class ShipMovingManager {
  private containerScene: Scene
  private soundsTarget = 0
  private soundsRunning = 0

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

      this.addSound()
    })
  }

  private addSound() {
    if (this.soundsRunning >= this.soundsTarget) return

    this.soundsRunning += 1
    gameData.sounds.move.play().then(() => {
      this.soundsRunning -= 1
    })
  }
}