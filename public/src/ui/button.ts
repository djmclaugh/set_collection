import type * as pixijs from "pixi.js";

import View from "./view.js";
import { newText } from "./text.js";

type Callback = () => void;

export default class Button extends View {
  private background: PIXI.Graphics = new PIXI.Graphics();
  private callbacks: Callback[] = [];
  private disabled: boolean = false;
  public width: number = 100;
  public height: number = 100;
  private text: PIXI.Text;

  private mouseover: boolean = false;
  private mousedown: boolean = false;

  constructor(text: string) {
    super();
    this.container.addChild(this.background);
    this.text = newText(text, 40);
    this.width = this.text.width + 16;
    this.text.x = 8;
    this.height = this.text.height + 16;
    this.text.y = 8;
    this.container.addChild(this.text);
    this.update();
    this.container.interactive = true;

    this.container.on("mouseover", () => {
      this.mouseover = true;
      this.update();
    });
    this.container.on("mouseout", () => {
      this.mouseover = false;
      this.mousedown = false;
      this.update();
    });

    this.container.on("mousedown", () => {
      this.mousedown = true;
      this.update();
    });
    this.container.on("mouseup", () => {
      if (this.mousedown && !this.disabled) {
        for (let cb of this.callbacks) {
          cb();
        }
      }
      this.mousedown = false;
      this.update();
    });
  }

  public setDisabled(disabled: boolean) {
    this.disabled = disabled;
    this.update();
  }

  public onClick(callback: Callback) {
    this.callbacks.push(callback);
  }

  private update() {
    this.background.clear();
    let colour = 0xFFFFFF;
    if (this.disabled) {
      colour = 0x808080;
    } else if (this.mouseover) {
      colour = 0xCFCFCF;
      if (this.mousedown) {
        colour = 0xAFAFAF;
      }
    }
    this.background.beginFill(colour, 0.9);
    this.background.lineStyle(2, 0x000000, 0.9);
    this.background.drawRect(1, 1, this.width - 2, this.height - 2);
  }
}
