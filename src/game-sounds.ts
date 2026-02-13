import { Resources } from "./resources";
import { ToggleSound } from "./utilities/toggle-sound";

export class GameSounds {
  private _shoot = Resources.SoundShoot
  private _fly = Resources.SoundFly
  private _boost = Resources.SoundBoost
  private _damage = Resources.SoundDamage
  private _explode = Resources.SoundExplode
  private _gameOver = Resources.SoundGameOver

  private _flyContinuous = new ToggleSound(this._fly)
  private _boostContinuous = new ToggleSound(this._boost)

  get shoot() { return this._shoot }
  get fly() { return this._fly }
  get boost() { return this._boost }
  get damage() { return this._damage }
  get explode() { return this._explode }
  get gameOver() { return this._gameOver }

  get flying() { return this._flyContinuous }
  get boosting() { return this._boostContinuous }
}