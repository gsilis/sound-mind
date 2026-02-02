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

  createCheckbox(title: string, callback: EventListenerOrEventListenerObject): HTMLLabelElement {
    const label = this.doc.createElement('label') as HTMLLabelElement
    const input = this.doc.createElement('input') as HTMLInputElement

    label.classList.add('checkbox')
    input.type = 'checkbox'
    input.addEventListener('change', callback)
    label.innerText = title
    label.prepend(input)
    this.handles.push({ element: input, callback })

    return label;
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