import type * as pixijs from "pixi.js";

const DEFAULT_STYLE = {
  fontFamily: "Cambria Math",
  fontSize: 36,
  fill: "#101010",
  stroke: '#101010',
}

export function newText(value: string, fontSize: number = 36) {
  const style = Object.assign({}, DEFAULT_STYLE);
  style.fontSize = fontSize;
  return new PIXI.Text(value, style);
}

export function newTextField(value: string, width: number, fontSize: number = 36) {
  const style = Object.assign({
    wordWrap: true,
    wordWrapWidth: width,
    align: "center",
  }, DEFAULT_STYLE);
  style.fontSize = fontSize;
  return new PIXI.Text(value, style);
}
