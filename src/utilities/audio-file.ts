export class AudioFile {
  private _recorder: MediaRecorder
  private _blob?: Blob

  constructor(recorder: MediaRecorder, initial?: Blob) {
    this._recorder = recorder
    this._blob = initial
  }

  get recorder(): MediaRecorder {
    return this._recorder
  }

  private onData = (event: BlobEvent) => {
    this._blob = event.data
  }
}