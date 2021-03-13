import type * as pixijs from "pixi.js";

import ZFCSet from "../../game/sets/zfcset.js";

import Button from "../button.js";
import View from "../view.js";
import SetView from "../set_view.js";
import { newTextField } from "../text.js";

const W = 560;
const H = 560;

type DiscoverCallback = (set: ZFCSet) => void;

export default class PairingPowerPane extends View {
  private button: Button;
  private selection1: ZFCSet|null = null;
  private selection1View: SetView|null = null;
  private selection2: ZFCSet|null = null;
  private selection2View: SetView|null = null;
  constructor() {
    super();
    const t = newTextField("Choose two sets then press the button to unlock the set containing both chosen sets.", W - 80);
    t.x = (W - t.width) / 2;
    t.y = 60;
    this.container.addChild(t);

    this.button = new Button("Pair!");
    this.button.x = (W - this.button.width) / 2;
    this.button.y = 460;
    this.button.setDisabled(true);
    this.add(this.button);
  }

  public setSelection(set: ZFCSet) {
    if (this.selection1View === null) {
      this.selection1 = set;
      this.selection1View = new SetView(this.selection1);
      this.selection1View.x = (W/2) - this.selection1View.xCenter();
      this.selection1View.y = 220;
      this.add(this.selection1View);
    } else if (this.selection2 === null) {
      this.selection2 = set;
      this.selection2View = new SetView(this.selection2);
      this.selection2View.x = (W/2) - this.selection2View.xCenter();
      this.selection2View.y = 320;
      this.add(this.selection2View);
      this.button.setDisabled(false);
    }
  }

  public onClick(callback: DiscoverCallback) {
    this.button.onClick(() => {
      if (this.selection1 != null && this.selection2 != null) {
        callback(ZFCSet.pair(this.selection1, this.selection2));
      }
    });
  }
}
