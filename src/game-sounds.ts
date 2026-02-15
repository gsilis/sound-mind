import { Sound } from "excalibur";
import { Resources } from "./resources";
import { ToggleSound } from "./utilities/toggle-sound";

export class GameSounds {
  private _idle = Resources.SoundIdle
  private _shoot = Resources.SoundShoot
  private _fly = Resources.SoundFly
  private _boost = Resources.SoundBoost
  private _damage = Resources.SoundDamage
  private _explode = Resources.SoundExplode
  private _gameOver = Resources.SoundGameOver

  private _idleContinuous = new ToggleSound(this._idle)
  private _flyContinuous = new ToggleSound(this._fly)
  private _boostContinuous = new ToggleSound(this._boost)

  get shoot() { return this._shoot }
  set shoot(s: Sound) { this._shoot = s }
  get idle() { return this._idle }
  set idle (s: Sound) { this._idle = s; this._idleContinuous.clip = s }
  get fly() { return this._fly }
  set fly(s: Sound) { this._fly = s; this._flyContinuous.clip = s }
  get boost() { return this._boost }
  set boost(s: Sound) { this._boost = s; this._boostContinuous.clip = s }
  get damage() { return this._damage }
  set damage(s: Sound) { this._damage = s }
  get explode() { return this._explode }
  set explode(s: Sound) { this._explode = s }
  get gameOver() { return this._gameOver }
  set gameOver(s: Sound) { this._gameOver = s }

  get flying() { return this._flyContinuous }
  get boosting() { return this._boostContinuous }
  get idling() { return this._idleContinuous }
}