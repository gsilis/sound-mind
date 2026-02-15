import { Sound } from "excalibur";
import { Resources } from "./resources";

export class GameSounds {
  private _idle = Resources.SoundIdle
  private _shoot = Resources.SoundShoot
  private _fly = Resources.SoundFly
  private _boost = Resources.SoundBoost
  private _damage = Resources.SoundDamage
  private _explode = Resources.SoundExplode
  private _gameOver = Resources.SoundGameOver

  constructor() {
    this._idle.loop = true
    this._fly.loop = true
    this._boost.loop = true
  }

  get shoot() { return this._shoot }
  set shoot(s: Sound) { this._shoot = s }
  get idle() { return this._idle }
  set idle (s: Sound) { this._idle = s; this._idle.loop = true; }
  get fly() { return this._fly }
  set fly(s: Sound) { this._fly = s; this._fly.loop = true; }
  get boost() { return this._boost }
  set boost(s: Sound) { this._boost = s; this._boost.loop = true; }
  get damage() { return this._damage }
  set damage(s: Sound) { this._damage = s }
  get explode() { return this._explode }
  set explode(s: Sound) { this._explode = s }
  get gameOver() { return this._gameOver }
  set gameOver(s: Sound) { this._gameOver = s }
}