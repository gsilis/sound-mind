export class ElementFactory {
  private doc: Document
  private handles: {element: HTMLElement, callback: EventListenerOrEventListenerObject}[] = []

  constructor(document: Document) {
    this.doc = document
  }

  createPrimaryButton(title: string, callback: EventListenerOrEventListenerObject): HTMLButtonElement {
    const element = this.createButton(title, callback)
    element.classList.add('primary')

    return element
  }

  createButton(title: string, callback: EventListenerOrEventListenerObject): HTMLButtonElement {
    const element = this.doc.createElement('button')
    element.innerText = title
    element.classList.add('button')
    element.addEventListener('click', callback)
    this.handles.push({ element, callback })

    return element
  }

  createSpacer(): HTMLElement {
    const spacer = this.doc.createElement('div')
    spacer.classList.add('spacer')

    return spacer
  }

  /**
   * Should be called when a scene cleans up
   */
  clear() {
    this.handles.forEach(({ element, callback }) => {
      element.removeEventListener('click', callback)
    })
    this.handles = []
  }
}