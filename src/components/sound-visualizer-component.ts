export class SoundVisualizerComponent extends HTMLElement {
  connectedCallback() {
  }
}

if (customElements && !customElements.get('sound-visualizer-component')) {
  customElements.define('sound-visualizer-component', SoundVisualizerComponent)
}