import { Actor, Color, Label, Scene, vec } from "excalibur"
import { Wave } from "../scenes/waves"
import { EmitCallback, ShipWave } from "./ship-wave"
import { Play } from "../scenes/play"
import { GameData } from "../game-data"

const gameData = GameData.getInstance()

export type CreateShipType = (column: number, objectType: string) => Actor

export class WaveManager {
  private _scene: Scene
  private _label: Label
  private _waveNumber: number = -1
  private _shipWave: ShipWave | null = null
  private _shipWaves: ShipWave[] = []
  private _createShip: CreateShipType
  private _waitActor: Actor = new Actor()

  constructor(scene: Scene, label: Label, creator: CreateShipType) {
    this._scene = scene
    this._label = label
    this._createShip = creator
  }

  add(ship: Wave) {
    const obj = new ShipWave(ship, this.onEmit, this.onComplete)

    this._shipWaves.push(obj)
  }

  clear() {
    this._shipWaves = []
    this._waveNumber = -1

    if (this._scene.contains(this._label)) {
      this._scene.remove(this._label)
    }

    if (this._scene.contains(this._waitActor)) {
      this._scene.remove(this._waitActor)
    }
  }

  nextWave() {
    this._waveNumber += 1
    this._shipWave = this._shipWaves[this._waveNumber] || null
  }

  update(elapsedTime: number) {
    if (this._shipWave) this._shipWave.update(elapsedTime)
    if (this._scene.contains(this._label)) {
      this._label.pos.x = this._scene.engine.screen.width / 2
      this._label.pos.y = 100
    }
  }

  private onEmit: EmitCallback = (row) => {
    row.split('').forEach((column, index) => {
      if (column !== '0') {
        const ship = this._createShip(index, column)

        this._scene.add(ship)
      }
    })
  }

  onComplete = async () => {
    this._shipWave = null
    this._scene.add(this._label)

    if (this._shipWaves[this._waveNumber + 1] === undefined) {
      this._scene.add(this._waitActor)
      this._waitActor.actions.delay(1000).callMethod(() => {
        this._label.text = `That's all!`
        this._label.opacity = 1
        this._scene.add(this._label)
      }).delay(5000).callMethod(() => {
        (this._scene as Play).setState('game-over')
        gameData.stop()
        this._scene.remove(this._waitActor)
        this._scene.remove(this._label)
      })
    } else {
      await this.showReadyMessage()
      this._scene.remove(this._label)
    }
  }

  private async showReadyMessage() {
    return this._label.actions.callMethod(() => {
      this._label.text = `Wave ${this._waveNumber + 2}`
      this._label.scale.x = 0.8
      this._label.scale.y = 0.8
      this._label.opacity = 0
    }).scaleTo({
      scale: vec(1, 1),
      duration: 200,
    }).fade(1, 500).delay(2000).callMethod(() => {
      this._label.text = 'Get Ready'
      return Promise.resolve()
    })
    .delay(1000)
    .callMethod(() => {
      this._label.opacity = 0
      return Promise.resolve()
    }).delay(2000).callMethod(() => {
      this.nextWave()
    }).toPromise()
  }
}