import { Color, Font, Label } from "excalibur";

export class LabelFactory {
  private font: Font
  private defaultColor: Color

  constructor(font: Font, color: Color) {
    this.font = font
    this.defaultColor = color
  }

  create(text: string, overrideColor?: Color): Label {
    const label = new Label({ font: this.font, color: overrideColor && overrideColor || this.defaultColor, text: text })

    return label
  }
}