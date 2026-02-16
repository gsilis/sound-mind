import { ElementFactory } from "./components/element-factory"
import { LabelFactory } from "./utilities/label-factory"
import { FONT_STANDARD, FONT_TITLE } from "./fonts"
import { Color } from "excalibur"
import { Boost } from "./boost"
import { ModalManager } from "./utilities/modal-manager"
import { GameSounds } from "./game-sounds"
import { RecorderFactory } from "./utilities/recorder-factory"

let _data: GameData

const STARTING_SCORE = 0
const STARTING_HP = 100
const SPEED = 200
const BOOST_MULTI = 2
const BOOST_RATE = 0.1
const BOOST_MAX = 2000
const SHOTS_AMOUNT = 500
export const TILE_SIZE = 38
export const COLUMNS = 20

export class GameData {
  private _elementFactory?: ElementFactory
  private _titleFactory?: LabelFactory
  private _labelFactory?: LabelFactory
  private _audioStream?: MediaStream
  private _score: number = STARTING_SCORE
  private _hp: number = STARTING_HP
  private _running: boolean = false
  private _boost = new Boost(BOOST_MAX, BOOST_RATE)
  private _speed = (SPEED / 1000)
  private _boostSpeed = this._speed * BOOST_MULTI
  private _shots = SHOTS_AMOUNT
  private _modalManager = new ModalManager(document.body)
  private _sounds = new GameSounds()
  private _recorder = new RecorderFactory(this)
  private _shotDamage = 5

  private constructor() {}

  static getInstance(): GameData {
    if (!_data) {
      _data = new GameData()
    }

    return _data
  }

  get modal() {
    return this._modalManager
  }

  get sounds() {
    return this._sounds
  }

  get recorderFactory(): RecorderFactory {
    return this._recorder
  }

  get elementFactory(): ElementFactory {
    if (!this._elementFactory) {
      this._elementFactory = new ElementFactory(document)
    }

    return this._elementFactory
  }

  get labelFactory(): LabelFactory {
    if (!this._labelFactory) {
      this._labelFactory = new LabelFactory(FONT_STANDARD, Color.White)
    }

    return this._labelFactory
  }

  get titleLabelFactory(): LabelFactory {
    if (!this._titleFactory) {
      this._titleFactory = new LabelFactory(FONT_TITLE, Color.White)
    }

    return this._titleFactory
  }

  get mediaStream() {
    return this._audioStream
  }

  set mediaStream(stream: MediaStream | undefined) {
    this._audioStream = stream
  }

  get shots() { return this._shots }
  set shots(value: number) { this._shots = value }
  get speed() { return this._speed }
  get boostSpeed() { return this._boostSpeed }
  get boost() { return this._boost }
  get running() { return this._running }
  get score() { return this._score }
  set score(points: number) { this._score = points }
  get hp() { return this._hp }
  set hp(points: number) {
    this._hp = Math.max(0, this._hp + points)

    if (this._hp === 0) {
      this._running = false
    }
  }

  get root(): HTMLDivElement {
    const dom = document.querySelector('body > div.container') as HTMLDivElement

    return dom || (document.createElement('div') as HTMLDivElement)
  }

  get shotDamage() { return this._shotDamage }

  reset() {
    this._hp = STARTING_HP
    this._score = STARTING_SCORE
    this._running = false
    this._shots = SHOTS_AMOUNT
    this._score = 0
    this._boost.reset()
  }

  start() {
    this._running = true
  }

  stop() {
    this._running = false
  }
}