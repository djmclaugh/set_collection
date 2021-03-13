import type * as pixijs from "pixi.js";

import ZFCSet from "../game/sets/zfcset.js";

import View from "./view.js";
import { newText } from "./text.js";
import Button from "./button.js";
import ButtonRow from "./button_row.js";
import ActionPane from "./action_pane/action_pane.js";
import ViewPane from "./view_pane/view_pane.js";

const W = 560;
const H = 720;

type DiscoverCallback = (set: ZFCSet) => void;

export default class RightPane extends View {
  discoverCallbacks: DiscoverCallback[] = [];
  private actionPane: ActionPane = new ActionPane();
  private viewPane: ViewPane = new ViewPane();
  private viewButtonRow: ButtonRow;
  private powerButtonRow: ButtonRow;

  constructor() {
    super();
    const powersButton = new Button("Powers");
    powersButton.x = 160;
    powersButton.y = H - powersButton.container.height - 12;
    powersButton.onClick(() => {
      this.actionPane.container.visible = true;
      this.viewPane.container.visible = false;
      this.powerButtonRow.container.visible = true;
      this.viewButtonRow.container.visible = false;
    });
    this.add(powersButton);

    const viewButton = new Button("View");
    viewButton.x = 20;
    viewButton.y = H - viewButton.container.height - 12;
    viewButton.onClick(() => {
      this.actionPane.container.visible = false;
      this.viewPane.container.visible = true;
      this.powerButtonRow.container.visible = false;
      this.viewButtonRow.container.visible = true;
    });
    this.add(viewButton);

    this.viewButtonRow = new ButtonRow(["Back", "Info", "???"]);
    this.viewButtonRow.on("Back", () => {
      this.actionPane.showEmptyPower();
    });
    this.viewButtonRow.x = 10;
    this.viewButtonRow.y = H - this.viewButtonRow.container.height - 88;
    this.viewButtonRow.container.visible = false;
    this.add(this.viewButtonRow);

    this.powerButtonRow = new ButtonRow(["Empty Set", "Nesting", "Pairing", "Union"]);
    this.powerButtonRow.on("Empty Set", () => {
      this.actionPane.showEmptyPower();
    });
    this.powerButtonRow.on("Nesting", () => {
      this.actionPane.showNestingPower();
    });
    this.powerButtonRow.on("Pairing", () => {
      this.actionPane.showPairingPower();
    });
    this.powerButtonRow.on("Union", () => {
      this.actionPane.showUnionPower();
    });
    this.powerButtonRow.x = 10;
    this.powerButtonRow.y = H - this.powerButtonRow.container.height - 88;
    this.add(this.powerButtonRow);

    const divider: PIXI.Graphics = new PIXI.Graphics();
    divider.lineStyle(1, 0x000000, 1);
    divider.moveTo(0, W);
    divider.lineTo(W, W);
    this.container.addChild(divider);
    this.add(this.actionPane);
    this.viewPane.container.visible = false;
    this.add(this.viewPane);
  }

  public onDiscover(callback: DiscoverCallback) {
    this.actionPane.onDiscover(callback);
  }

  public select(selection: ZFCSet) {
    if (this.actionPane.container.visible) {
      this.actionPane.select(selection);
    } else if (this.viewPane.container.visible) {
      this.viewPane.select(selection);
    }
  }
}
