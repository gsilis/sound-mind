let registered = false

const template = `
  <div className="root">
  </div>
`

export class RecordAudioComponent extends HTMLElement {
  connectedCallback() {
    
  }
}

if (!registered && customElements) {
  registered = true
  customElements.define('record-audio', RecordAudioComponent)
}