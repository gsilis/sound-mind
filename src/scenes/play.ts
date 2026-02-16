import { Actor, BoundingBox, Canvas, Color, Engine, Label, Scene, SceneActivationContext, TextAlign } from "excalibur";
import { Player } from "../player";
import { LevelWidget } from "../level-widget";
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
import { COLUMNS, GameData, TILE_SIZE } from "../game-data";
import { TemporaryItemManager } from "../components/temporary-item-manager";
import { Explosion } from "../components/explosion";
import { Hit } from "../components/hit";
import { ShipMovingManager } from "../utilities/ship-moving-manager";
import { WaveManager } from "../game-workers/wave-manager";
import { WAVES } from "./waves";
import { DropFactory } from "../components/drop-factory";
import { SpeedObject } from "../interfaces/speed-object";

const gameData = GameData.getInstance()

export class Play extends Scene {
  private _shotFactory = new ShotFactory()
  private _shipCreator = new ShipFactory()
  private _dropFactory = new DropFactory()
  private _playerCollisions?: PlayerCollisions
  private _shipCollisions?: ShipCollisions
  private _controller: ControlStateMachine<Play> = new ControlStateMachine()
  private _pauseLabel = gameData.titleLabelFactory.create('Paused')
  private _pauseInstructions = gameData.labelFactory.create('Press [ESC] to continue')
  private _gameOverLabel = gameData.titleLabelFactory.create('GAME OVER')
  private _gameOverInstructions = gameData.labelFactory.create('Press [ENTER] to continue')
  private _explosionManager?: TemporaryItemManager<Explosion>
  private _hitManager?: TemporaryItemManager<Hit>
  private scoreLabel = gameData.labelFactory.create('SCORE', Color.Gray)
  private score = gameData.labelFactory.create('')
  playerBounds?: BoundingBox
  player?: Player
  boostLevel?: LevelWidget
  healthLevel?: LevelWidget
  shotBalance?: Label
  shotBalanceLabel?: Label
  background: Actor = new Actor()
  backgroundCanvas?: Canvas
  backgroundOffset = 0
  wrappedCreateShot?: CallableFunction
  movingManager = new ShipMovingManager(this)
  waves?: WaveManager

  override onInitialize(engine: Engine): void {
    this._pauseLabel.font.textAlign = TextAlign.Center
    this._pauseInstructions.font.textAlign = TextAlign.Center
    this._gameOverLabel.font.textAlign = TextAlign.Center
    this._gameOverInstructions.font.textAlign = TextAlign.Center
    this._explosionManager = new TemporaryItemManager(this, Explosion, 'explosion')
    this._hitManager = new TemporaryItemManager(this, Hit, 'hit')

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
    this.add(this.background)

    this.player = new Player()
    this.add(this.player)

    this.boostLevel = new LevelWidget(gameData.boost.max, Color.Green)
    this.add(this.boostLevel)

    this.healthLevel = new LevelWidget(gameData.hp, Color.Red)
    this.add(this.healthLevel)

    this.shotBalanceLabel = gameData.labelFactory.create('Shots', Color.Gray)
    this.shotBalance = gameData.labelFactory.create('')
    this.add(this.shotBalanceLabel)
    this.add(this.shotBalance)

    this.scoreLabel.font.textAlign = TextAlign.Left
    this.add(this.scoreLabel)
    this.add(this.score)

    this.wrappedCreateShot = rateLimiter(this.addShot.bind(this), 500)

    this._playerCollisions = new PlayerCollisions(this, this.player)
    this._shipCollisions = new ShipCollisions(this, this._explosionManager, this._hitManager)
    this.waves = new WaveManager(this, gameData.titleLabelFactory.create('', Color.Yellow), this.createObjectInColumn)

    this._controller.addState('play', new PlayScheme(), ['pause', 'game-over'])
    this._controller.addState('pause', new PauseScheme(), ['play'])
    this._controller.addState('game-over', new GameOverScheme(), ['play'])

    this.scoreLabel.z = 1000
    this.shotBalanceLabel.z = 1000
    this.shotBalance.z = 1000
    this.healthLevel.z = 1000
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    this._controller.update(this, engine, elapsedMs)

    const { width, height } = engine.screen

    if (this.healthLevel) {
      this.healthLevel.level = gameData.hp
    }
    
    if (this.shotBalance) {
      this.shotBalance.text = `${gameData.shots}`
      this.shotBalance.pos.y = 20
      this.shotBalance.pos.x = (this.healthLevel?.pos.x || 0) - this.shotBalance.getTextWidth() - 10
    }

    if (this.shotBalanceLabel) {
      this.shotBalanceLabel.pos.y = 20
      this.shotBalanceLabel.pos.x = (this.shotBalance?.pos.x || 0) - this.shotBalanceLabel.getTextWidth() - 5
    }

    if (this._controller.isCurrent('pause')) {
      !this.actors.includes(this._pauseLabel) && this.add(this._pauseLabel)
      !this.actors.includes(this._pauseInstructions) && this.add(this._pauseInstructions)

      this._pauseLabel.pos.x = width / 2
      this._pauseInstructions.pos.x = width / 2

      this._pauseLabel.pos.y = (height / 2) - 60
      this._pauseInstructions.pos.y = (height / 2)
      
      gameData.sounds.idle.stop()
    } else {
      this.actors.includes(this._pauseLabel) && this.remove(this._pauseLabel)
      this.actors.includes(this._pauseInstructions) && this.remove(this._pauseInstructions)
    }

    if (this._controller.isCurrent('game-over')) {
      !this.actors.includes(this._gameOverLabel) && this.add(this._gameOverLabel)
      !this.actors.includes(this._gameOverInstructions) && this.add(this._gameOverInstructions)

      this._gameOverLabel.pos.x = width / 2
      this._gameOverInstructions.pos.x = width / 2

      this._gameOverLabel.pos.y = (height / 2) - 60
      this._gameOverInstructions.pos.y = height / 2

      gameData.sounds.idle.stop()
    } else {
      this.actors.includes(this._gameOverLabel) && this.remove(this._gameOverLabel)
      this.actors.includes(this._gameOverInstructions) && this.remove(this._gameOverInstructions)
    }

    this.score.text = `${gameData.score}`
    this.scoreLabel.pos.x = 10
    this.scoreLabel.pos.y = 10
    this.score.pos.x = this.scoreLabel.getTextWidth() + 10
    this.score.pos.y = this.scoreLabel.pos.y

    this.movingManager.update(engine, elapsedMs)
    this._hitManager?.update(engine)
    this._explosionManager?.update(engine)
    gameData.running && this.waves?.update(elapsedMs)
  }

  override onActivate(context: SceneActivationContext<unknown, undefined>): void {
    const width = context.engine.screen.width
    const halfWidth = width / 2
    const height = context.engine.screen.height
    const third = height / 3

    this.background.pos.x = context.engine.screen.canvasWidth
    this.background.pos.y = context.engine.screen.canvasHeight
    this.playerBounds = new BoundingBox(20, third, width - 40, height - 100)

    if (this.player) {
      this.player.pos.x = halfWidth
      this.player.pos.y = height - 100
    }

    if (this.boostLevel) {
      this.boostLevel.pos.x = width - 20
      this.boostLevel.pos.y = 10
    }

    if (this.healthLevel && this.boostLevel) {
      this.healthLevel.pos.x = this.boostLevel.pos.x - 20
      this.healthLevel.pos.y = this.boostLevel.pos.y
    }

    this._controller.transitionTo('play')
    WAVES.forEach(wave => {
      this.waves?.add(wave)
    })
    this.waves?.onComplete()
  }

  override onDeactivate(context: SceneActivationContext) {
    const actors = [...this.actors]
    const toRemove = ['ship', 'shot']

    actors.forEach(actor => {
      if (toRemove.includes(actor.name)) {
        this.remove(actor)
      }
    })

    this.waves?.clear()
  }

  setState = (newState: string) => {
    this._controller.transitionTo(newState)
  }

  private addShot() {
    if (!this.player) return
    const { x, y } = this.player.pos
    const shot = this._shotFactory.create(x, y - 40)
    this.add(shot)

    gameData.sounds.shoot.play()
  }

  private createObjectInColumn = (column: number, objectType: string) => {
    const gameSpaceWidth = COLUMNS * TILE_SIZE
    const xOffset = (this.engine.canvas.width / 2) - (gameSpaceWidth / 2) + (TILE_SIZE / 2)
    const x = (column * TILE_SIZE) + xOffset
    let object: (SpeedObject & Actor) | null = null

    switch (objectType) {
      case '1':
        object = this._shipCreator.create(x, -20)
        object && this._shipCollisions?.add(object)
        break

      case 'A':
        object = this._dropFactory.createAmmo(x, -20)
        break

      case 'F':
        object = this._dropFactory.createFuel(x, -20)
        break
    }

    if (object === null) {
      throw new Error('Cannot deal with null object...')
    }

    return object
  }
}