import { BoundingBox, Color, DefaultLoader, Engine, ExcaliburGraphicsContext, Scene, SceneActivationContext } from "excalibur";
import { Player } from "./player";
import { LevelWidget } from "./boost-level";

export class MyLevel extends Scene {
  private player?: Player
  private boostLevel?: LevelWidget

  override onInitialize(engine: Engine): void {
    // Scene.onInitialize is where we recommend you perform the composition for your game
    const width = engine.screen.halfCanvasWidth
    const height = engine.screen.height
    const third = height / 3
    this.player = new Player(new BoundingBox(20, third, width - 40, height - 100))
    this.player.pos.x = width / 2
    this.player.pos.y = height - 100
    this.add(this.player) // Actors need to be added to a scene to be drawn

    this.boostLevel = new LevelWidget(this.player.boostMax, Color.Green)
    this.boostLevel.pos.x = width - 20
    this.boostLevel.pos.y = 10
    this.add(this.boostLevel)
  }

  override onPreLoad(loader: DefaultLoader): void {
    // Add any scene specific resources to load
  }

  override onActivate(context: SceneActivationContext<unknown>): void {
    // Called when Excalibur transitions to this scene
    // Only 1 scene is active at a time
  }

  override onDeactivate(context: SceneActivationContext): void {
    // Called when Excalibur transitions away from this scene
    // Only 1 scene is active at a time
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    if (this.boostLevel && this.player) {
      this.boostLevel.level = this.player.boostLevel
    }
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    // Called after everything updates in the scene
  }

  override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called before Excalibur draws to the screen
  }

  override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called after Excalibur draws to the screen
  }
}