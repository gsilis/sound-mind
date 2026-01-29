import { BoundingBox, Color, Engine, Scene } from "excalibur";
import { Player } from "./player";
import { LevelWidget } from "./boost-level";

export class MyLevel extends Scene {
  private player?: Player
  private boostLevel?: LevelWidget
  backgroundColor = Color.Azure

  override onInitialize(engine: Engine): void {
    // Scene.onInitialize is where we recommend you perform the composition for your game
    const width = engine.screen.width
    const halfWidth = engine.screen.halfCanvasWidth
    const height = engine.screen.height
    const third = height / 3
    this.player = new Player(new BoundingBox(20, third, width - 40, height - 100))
    this.player.pos.x = halfWidth
    this.player.pos.y = height - 100
    this.add(this.player) // Actors need to be added to a scene to be drawn

    this.boostLevel = new LevelWidget(this.player.boostMax, Color.Green)
    this.boostLevel.pos.x = width - 20
    this.boostLevel.pos.y = 10
    this.add(this.boostLevel)
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    if (this.boostLevel && this.player) {
      this.boostLevel.level = this.player.boostLevel
    }
  }
}