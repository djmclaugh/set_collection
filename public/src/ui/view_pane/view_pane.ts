import type * as pixijs from "pixi.js";

import ZFCSet from "../../game/sets/zfcset.js";

import View from "../view.js";
import { newTextField } from "../text.js";
import Button from "../button.js";
import SetView from "../set_view.js";

const W = 560;
const H = 560;

export default class ActionPane extends View {
  private selectedSet: ZFCSet|null = null;
  private selectedSetView: SetView|null = null;
  private text: PIXI.Text;

  constructor() {
    super();
    this.text = newTextField("Select a set to see its properties.", 500);
    this.text.x = (W - this.text.width) / 2
    this.text.y = 100;
    this.container.addChild(this.text);
  }

  public select(selection: ZFCSet) {
    this.selectedSet = selection;
    if (this.selectedSetView !== null) {
      this.remove(this.selectedSetView);
    }
    this.selectedSetView = new SetView(selection);
    this.selectedSetView.x = (W / 2) - this.selectedSetView.xCenter();
    this.selectedSetView.y = 300;
    this.selectedSetView.setChildrenInteractable();
    this.add(this.selectedSetView);
  }
}
