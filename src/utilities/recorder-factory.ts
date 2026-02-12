import { AudioFile } from "./audio-file"

export class RecorderFactory {
  private _stream?: MediaStream

  setup() {
    return navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => {
      this._stream = stream
    })
  }

  create(): AudioFile {
    if (!this._stream) {
      throw new Error('Media stream has not been initialized')
    }

    return new AudioFile(new MediaRecorder(this._stream))
  }
}