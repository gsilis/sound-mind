import { Actor, ActorArgs, Canvas, Color, Engine } from "excalibur";

export class GradientBackground extends Actor {
  private _from?: Color
  private _to?: Color
  private _canvas: Canvas

  get from() { return this._from }
  set from(color: Color | undefined) { this._from = color }
  get to() { return this._to }
  set to(color: Color | undefined) { this._to = color }

  constructor(args?: ActorArgs) {
    super(args)

    this._canvas = new Canvas({ draw: this.onDraw, width: args?.width, height: args?.height })
  }

  onAdd(engine: Engine): void {
    this.graphics.use(this._canvas)
  }

  private onDraw = (context: CanvasRenderingContext2D) => {
    if (!this._from || !this._to) return

    const { width, height } = context.canvas
    const halfWidth = width / 2
    const gradient = context.createLinearGradient(0, halfWidth, 0, height)
    gradient.addColorStop(0, this._from.toString())
    gradient.addColorStop(1, this._to.toString())

    context.fillStyle = gradient
    context.fillRect(0, 0, width, height)
  }
}