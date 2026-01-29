import { DefaultLoader } from "excalibur";

export class Loader extends DefaultLoader {
  override onDraw(ctx: CanvasRenderingContext2D): void {
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    const halfWidth = width / 2
    const halfHeight = height / 2
    const progress = Math.round(this.progress * 100)
    const gradient = ctx.createLinearGradient(halfWidth, 0, halfWidth, height)
    gradient.addColorStop(0, '#333333')
    gradient.addColorStop(1, 'black')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.font = '25px Arial'
    ctx.fillText(`SOUND MIND`, halfWidth, halfHeight - 40)
    ctx.font = '15px Arial'
    ctx.fillText(`LOADING ${progress}%`, halfWidth, halfHeight + 20)
  }
}