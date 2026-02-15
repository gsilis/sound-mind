import { GameData } from "../game-data"

export class RecorderFactory {
  private _gameData: GameData

  constructor(gameData: GameData) {
    this._gameData = gameData
  }

  create(): MediaRecorder {
    const stream = this._gameData.mediaStream

    if (!stream) {
      throw new Error('Media stream has not been initialized')
    }

    return new MediaRecorder(stream)
  }
}