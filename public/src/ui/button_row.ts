import type * as pixijs from "pixi.js";

import View from "./view.js";
import { newText } from "./text.js";
import Button from "./button.js";

const W = 560;
const H = 720;

type Callback = () => void;

export default class ButtonRow extends View {
  private callbacks: Map<string, Callback[]> = new Map();

  constructor(buttonNames: string[]) {
    super();
    let x = 0;
    for (let name of buttonNames) {
      const b = new Button(name);
      b.x = x;
      x += b.width + 10;
      this.callbacks.set(name, []);
      b.onClick(() => {
        for (let cb of this.callbacks.get(name)!) {
          cb();
        }
      });
      this.add(b);
    }
  }

  public on(name: string, callback: Callback) {
    const callbacks = this.callbacks.get(name);
    if (callbacks !== undefined) {
      callbacks.push(callback);
    }
  }
}
