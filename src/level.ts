import { Actor, BoundingBox, Canvas, Color, Engine, Keys, Scene } from "excalibur";
import { Player } from "./player";
import { LevelWidget } from "./boost-level";
import { Resources } from "./resources";
import { FireContainer } from "./components/fire-container";
import { ShotFactory } from "./components/shot-factory";
import { rateLimiter } from "./utilities/rate-limiter";

export class MyLevel extends Scene {
  private player?: Player
  private boostLevel?: LevelWidget
  private background: Actor = new Actor()
  private backgroundCanvas?: Canvas
  private backgroundOffset = 0
  private _shotFactory = new ShotFactory()
  private _shots?: FireContainer
  private _wrappedCreateShot?: CallableFunction

  override onInitialize(engine: Engine): void {
    // Scene.onInitialize is where we recommend you perform the composition for your game
    const width = engine.screen.width
    const halfWidth = engine.screen.halfCanvasWidth
    const height = engine.screen.height
    const third = height / 3

    this.backgroundCanvas = new Canvas({
      width: engine.canvasWidth * 2,
      height: engine.canvasHeight * 2,
      draw: (context) => {
        const pattern = context.createPattern(Resources.Background.image, 'repeat')

        if (pattern) {
          context.fillStyle = pattern
          context.fillRect(0, 0, engine.canvasWidth * 2, engine.canvasHeight * 2)
        }
      }
    })
    this.background.graphics.use(this.backgroundCanvas)
    this.background.pos.x = engine.screen.canvasWidth
    this.background.pos.y = engine.screen.canvasHeight
    this.add(this.background)

    this.player = new Player(new BoundingBox(20, third, width - 40, height - 100))
    this.player.pos.x = halfWidth
    this.player.pos.y = height - 100
    this.add(this.player) // Actors need to be added to a scene to be drawn

    this.boostLevel = new LevelWidget(this.player.boostMax, Color.Green)
    this.boostLevel.pos.x = width - 20
    this.boostLevel.pos.y = 10
    this.add(this.boostLevel)

    this._shots = new FireContainer({ factory: this._shotFactory, width, height })
    this._wrappedCreateShot = rateLimiter(this._shots.addShot.bind(this._shots), 100)
    this.add(this._shots)
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    const keyboard = engine.input.keyboard
    const space = keyboard.isHeld(Keys.Space)
    const rightShift = keyboard.isHeld(Keys.ShiftRight)

    if (this.boostLevel && this.player) {
      this.boostLevel.level = this.player.boostLevel
    }

    this.backgroundOffset += (elapsedMs / 10)
    this.backgroundOffset = this.backgroundOffset % 64
    const widthOffset = engine.screen.canvasWidth - ((this.player?.pos.x || 0) / 3)

    this.background.pos.y = this.backgroundOffset
    this.background.pos.x = widthOffset

    if ((space || rightShift) && this._wrappedCreateShot) {
      this._wrappedCreateShot(this.player?.pos.x || 0, this.player?.pos.y || 0)
    }
  }
}