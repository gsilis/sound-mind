import { Actor, BoundingBox, Canvas, Color, Engine, Keys, Scene, SceneActivationContext } from "excalibur";
import { Player } from "../player";
import { LevelWidget } from "../boost-level";
import { Resources } from "../resources";
import { ShotFactory } from "../components/shot-factory";
import { rateLimiter } from "../utilities/rate-limiter";
import { ShipFactory } from "../components/ship-factory";
import { between } from "../utilities/random";
import { PlayerCollisions } from "../game-workers/player-collisions";
import { ShipCollisions } from "../game-workers/ship-collisions";
import { ControlStateMachine } from "../control-schemes/control-state-machine";
import { PlayScheme } from "../control-schemes/play-scheme";
import { PauseScheme } from "../control-schemes/pause-scheme";
import { GameOverScheme } from "../control-schemes/game-over-scheme";
import { GameData } from "../game-data";

const gameData = GameData.getInstance()

export class Play extends Scene {
  private _shotFactory = new ShotFactory()
  private _shipCreator = new ShipFactory()
  private _playerCollisions?: PlayerCollisions
  private _shipCollisions?: ShipCollisions
  private _controller: ControlStateMachine<Play> = new ControlStateMachine()
  playerBounds?: BoundingBox
  player?: Player
  boostLevel?: LevelWidget
  background: Actor = new Actor()
  backgroundCanvas?: Canvas
  backgroundOffset = 0
  wrappedCreateShot?: CallableFunction
  wrappedShipContainer?: CallableFunction

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

    this.playerBounds = new BoundingBox(20, third, width - 40, height - 100)
    this.player = new Player()
    this.player.pos.x = halfWidth
    this.player.pos.y = height - 100
    this.add(this.player) // Actors need to be added to a scene to be drawn

    this.boostLevel = new LevelWidget(gameData.boost.max, Color.Green)
    this.boostLevel.pos.x = width - 20
    this.boostLevel.pos.y = 10
    this.add(this.boostLevel)

    this.wrappedCreateShot = rateLimiter(this.addShot.bind(this), 500)
    this.wrappedShipContainer = rateLimiter(this.addShip.bind(this), 20000)

    this._playerCollisions = new PlayerCollisions(this, this.player)
    this._shipCollisions = new ShipCollisions(this)

    this._controller.addState('play', new PlayScheme(), ['pause', 'game-over'])
    this._controller.addState('pause', new PauseScheme(), ['play'])
    this._controller.addState('game-over', new GameOverScheme(), ['play'])
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    this._controller.update(this, engine, elapsedMs)
  }

  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
    this._controller.transitionTo('play')
  }

  private addShot() {
    if (!this.player) return
    const { x, y } = this.player.pos
    const shot = this._shotFactory.create(x, y - 40)
    this.add(shot)
  }

  private addShip() {
    const x = between(5, this.engine.screen.width - 5)
    const y = -20
    const ship = this._shipCreator.create(x, y, '')
    this._shipCollisions?.add(ship)
    this.add(ship)
  }
}