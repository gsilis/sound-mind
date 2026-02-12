import { Resources } from "./resources";
import { ToggleSound } from "./utilities/toggle-sound";

export class GameSounds {
  private _shoot = Resources.SoundShoot
  private _fly = Resources.SoundFly
  private _boost = Resources.SoundBoost
  private _shipMove = Resources.SoundMove
  private _explode = Resources.SoundExplode

  private _flyContinuous = new ToggleSound(this._fly)
  private _boostContinuous = new ToggleSound(this._boost)

  get shoot() { return this._shoot }
  get fly() { return this._fly }
  get boost() { return this._boost }
  get move() { return this._shipMove }
  get explode() { return this._explode }

  get flying() { return this._flyContinuous }
  get boosting() { return this._boostContinuous }
}