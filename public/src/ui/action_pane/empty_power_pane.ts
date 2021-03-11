import type * as pixijs from "pixi.js";

import Button from "../button.js";
import View from "../view.js";
import { newTextField } from "../text.js";

const W = 560;
const H = 560;

type Callback = () => void;

export default class EmptyPowerPane extends View {
  private button: Button;
  constructor() {
    super();
    const t = newTextField("Press the button to unlock the empty set.", W - 80);
    t.x = 40;
    t.y = 100;
    this.container.addChild(t);

    this.button = new Button("Empty!");
    this.button.x = (W - this.button.width) / 2;
    this.button.y = 300;
    this.add(this.button);
  }

  public onClick(callback: Callback) {
    this.button.onClick(callback);
  }
}
