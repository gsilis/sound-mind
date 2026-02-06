import { Actor, BoundingBox, Canvas, Color, Engine, Keys, Scene } from "excalibur";
import { Player } from "./player";
import { LevelWidget } from "./boost-level";
import { Resources } from "./resources";
import { ShotFactory } from "./components/shot-factory";
import { rateLimiter } from "./utilities/rate-limiter";
import { ShipFactory } from "./components/ship-factory";
import { between } from "./utilities/random";

export class MyLevel extends Scene {
  private player?: Player
  private boostLevel?: LevelWidget
  private background: Actor = new Actor()
  private backgroundCanvas?: Canvas
  private backgroundOffset = 0
  private _shotFactory = new ShotFactory()
  private _wrappedCreateShot?: CallableFunction
  private _shipCreator = new ShipFactory()
  private _wrappedShipContainer?: CallableFunction

  override onInitialize(engine: Engine): void {
    // Scene.onInitialize is where we recommend you perform the composition for your game
    const width = engine.screen.width
    const halfWidth = width / 2
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

    this._wrappedCreateShot = rateLimiter(this.addShot.bind(this), 500)
    this._wrappedShipContainer = rateLimiter(this.addShip.bind(this), 20000)
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    const width = engine.screen.width
    const height = engine.screen.height
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

    if (this._wrappedShipContainer) {
      const xCoordinate = between(20, width - 29)
      this._wrappedShipContainer(xCoordinate, -20, '')
    }

    const actors = [...this.actors]

    // Cleanup
    actors.forEach((actor) => {
      if (actor.name === 'ship') {
        if (actor.pos.y > height + 50) {
          this.remove(actor)
        }
      } else if (actor.name === 'shot') {
        if (actor.pos.y < 0) {
          this.remove(actor)
        }
      }
    })
  }

  private addShot() {
    if (!this.player) return
    const { x, y } = this.player.pos
    const shot = this._shotFactory.create(x, y)
    shot.on('collisionstart', () => {
      console.log('START shot')
    })
    shot.on('collisionend', () => {
      console.log('END collision')
    })
    this.add(shot)
  }

  private addShip() {
    const x = between(5, this.engine.screen.width - 5)
    const y = -20
    const ship = this._shipCreator.create(x, y, '')
    ship.on('collisionstart', () => {
      console.log('StART')
    })
    ship.on('collisionend', () => {
      console.log('END')
    })
    this.add(ship)
  }
}