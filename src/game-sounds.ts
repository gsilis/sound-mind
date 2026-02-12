import { Sound } from "excalibur";
import { Resources } from "./resources";

export class GameSounds {
  private _shoot = Resources.SoundShoot
  private _fly = Resources.SoundFly
  private _boost = Resources.SoundBoost
  private _shipMove = Resources.SoundMove
  private _explode = Resources.SoundExplode

  get shoot() { return this._shoot }
  get fly() { return this._fly }
  get boost() { return this._boost }
  get move() { return this._shipMove }
  get explode() { return this._explode }
}