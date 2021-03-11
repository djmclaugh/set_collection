import type * as pixijs from "pixi.js";

import ZFCSet from "../game/zfcset.js";

import View from "./view.js";
import { newText } from "./text.js";
import Button from "./button.js";
import EmptyPowerPane from "./action_pane/empty_power_pane.js";

const W = 560;
const H = 720;

type DiscoverCallback = (set: ZFCSet) => void;

export default class RightPane extends View {
  discoverCallbacks: DiscoverCallback[] = [];

  constructor() {
    super();
    const b = new Button("Powers");
    b.x = 100;
    b.y = H - b.container.height - 12;
    this.add(b);

    const c = new Button("Empty Set");
    c.x = 100;
    c.y = H - c.container.height - 88;
    this.add(c);

    const action = new EmptyPowerPane();
    action.onClick(() => {
      for (let cb of this.discoverCallbacks) {
        cb(ZFCSet.EMPTY);
      }
    });
    this.add(action);

    const divider: PIXI.Graphics = new PIXI.Graphics();
    divider.lineStyle(1, 0x000000, 1);
    divider.moveTo(0, W);
    divider.lineTo(W, W);
    this.container.addChild(divider);
  }

  public onDiscover(callback: DiscoverCallback) {
    this.discoverCallbacks.push(callback);
  }
}
