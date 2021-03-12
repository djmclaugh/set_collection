import type * as pixijs from "pixi.js";

import ZFCSet from "../../game/zfcset.js";

import Button from "../button.js";
import View from "../view.js";
import SetView from "../set_view.js";
import { newTextField } from "../text.js";

const W = 560;
const H = 560;

type DiscoverCallback = (set: ZFCSet) => void;

export default class NestingPowerPane extends View {
  private button: Button;
  private selection: ZFCSet|null = null;
  private selectionView: SetView|null = null;
  constructor() {
    super();
    const t = newTextField("Choose a set then press the button to unlock the set containing the chosen set.", W - 80);
    t.x = (W - t.width) / 2;
    t.y = 80;
    this.container.addChild(t);

    this.button = new Button("Nest!");
    this.button.x = (W - this.button.width) / 2;
    this.button.y = 400;
    this.button.setDisabled(true);
    this.add(this.button);
  }

  public setSelection(set: ZFCSet|null) {
    if (this.selectionView) {
      this.remove(this.selectionView);
      this.selectionView = null;
    }
    this.selection = set;
    this.button.setDisabled(this.selection === null);
    if (this.selection !== null) {
      this.selectionView = new SetView(this.selection);
      this.selectionView.x = (W/2) - this.selectionView.xCenter();
      this.selectionView.y = 260;
      this.add(this.selectionView);
    }
  }

  public onClick(callback: DiscoverCallback) {
    this.button.onClick(() => {
      if (this.selection != null) {
        callback(ZFCSet.pair(this.selection));
      }
    });
  }
}
