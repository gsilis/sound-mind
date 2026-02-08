import { Font, TextAlign } from "excalibur";

const family = 'sans-serif'

export const FONT_TITLE = new Font({ family, size: 60, bold: true, textAlign: TextAlign.Center })
export const FONT_SUBHEAD = new Font({ family, size: 40, bold: true, textAlign: TextAlign.Center })
export const FONT_STANDARD = new Font({ family, size: 14, bold: true, textAlign: TextAlign.Left })