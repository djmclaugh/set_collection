import type * as pixijs from "pixi.js";

import ZFCSet from "../game/zfcset.js";

import View from "./view.js";
import { newText } from "./text.js";
import Button from "./button.js";
import EmptyPowerPane from "./action_pane/empty_power_pane.js";
import NestingPowerPane from "./action_pane/nesting_power_pane.js";
import PairingPowerPane from "./action_pane/pairing_power_pane.js";

const W = 560;
const H = 720;

type DiscoverCallback = (set: ZFCSet) => void;

export default class RightPane extends View {
  discoverCallbacks: DiscoverCallback[] = [];
  private actionPane: EmptyPowerPane|NestingPowerPane|PairingPowerPane = new EmptyPowerPane();

  constructor() {
    super();
    const b = new Button("Powers");
    b.x = 100;
    b.y = H - b.container.height - 12;
    this.add(b);

    const emptyButton = new Button("Empty Set");
    emptyButton.x = 20;
    emptyButton.y = H - emptyButton.container.height - 88;
    emptyButton.onClick(() => {
      this.remove(this.actionPane);
      this.actionPane = new EmptyPowerPane();
      this.actionPane.onClick(() => {
        for (let cb of this.discoverCallbacks) {
          cb(ZFCSet.EMPTY);
        }
      });
      this.add(this.actionPane);
    });
    this.add(emptyButton);

    const nestButton = new Button("Nesting");
    nestButton.x = 220;
    nestButton.y = H - nestButton.container.height - 88;
    nestButton.onClick(() => {
      this.remove(this.actionPane);
      this.actionPane = new NestingPowerPane();
      this.actionPane.onClick((set: ZFCSet) => {
        for (let cb of this.discoverCallbacks) {
          cb(set);
        }
      });
      this.add(this.actionPane);
    });
    this.add(nestButton);

    const pairButton = new Button("Pairing");
    pairButton.x = 380;
    pairButton.y = H - pairButton.container.height - 88;
    pairButton.onClick(() => {
      this.remove(this.actionPane);
      this.actionPane = new PairingPowerPane();
      this.actionPane.onClick((set: ZFCSet) => {
        for (let cb of this.discoverCallbacks) {
          cb(set);
        }
      });
      this.add(this.actionPane);
    });
    this.add(pairButton);

    this.actionPane.onClick(() => {
      for (let cb of this.discoverCallbacks) {
        cb(ZFCSet.EMPTY);
      }
    });
    this.add(this.actionPane);

    const divider: PIXI.Graphics = new PIXI.Graphics();
    divider.lineStyle(1, 0x000000, 1);
    divider.moveTo(0, W);
    divider.lineTo(W, W);
    this.container.addChild(divider);
  }

  public onDiscover(callback: DiscoverCallback) {
    this.discoverCallbacks.push(callback);
  }

  public select(selection: ZFCSet) {
    if (this.actionPane instanceof NestingPowerPane) {
      this.actionPane.setSelection(selection);
    } else if (this.actionPane instanceof PairingPowerPane) {
      this.actionPane.setSelection(selection);
    }
  }
}
