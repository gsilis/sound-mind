import { Actor, DefaultLoader } from "excalibur";

export class Loader extends DefaultLoader {
  private loaded: boolean = false
  private get _startElement(): HTMLButtonElement {
    let button = document.getElementById('start-button') as HTMLButtonElement

    if (!button) {
      button = document.createElement('button') as HTMLButtonElement
      button.id = 'start-button'
      button.classList.add('start-button', 'button')
      button.innerText = 'Begin'
      button.type = 'button'
      document.getElementById('container')?.appendChild(button)
    }

    return button
  }

  override onDraw(ctx: CanvasRenderingContext2D): void {
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    const halfWidth = width / 2
    const halfHeight = height / 2
    const progress = Math.round(this.progress * 100)
    const gradient = ctx.createLinearGradient(halfWidth, 0, halfWidth, height)
    gradient.addColorStop(0, '#333333')
    gradient.addColorStop(1, 'black')
    const buttonGradient = ctx.createLinearGradient(0.5, 0, 0.5, 1)
    buttonGradient.addColorStop(0, '#CCCCCC')
    buttonGradient.addColorStop(1, '#666666')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.font = '25px Arial'
    ctx.fillText(`SOUND MIND`, halfWidth, halfHeight - 40)

    if (!this.loaded) {
      ctx.font = '15px Arial'
      ctx.fillText(`LOADING ${progress}%`, halfWidth, halfHeight + 20)
    }
  }

  onUserAction(): Promise<void> {
    this.loaded = true
    
    return new Promise(resolve => {
      const handler = () => {
        this._startElement.removeEventListener('click', handler)
        this._startElement.parentElement?.removeChild(this._startElement)
        resolve()
      }

      this._startElement.addEventListener('click', handler)
    })
  }
}