import type * as pixijs from "pixi.js";

import SetDefinition from "../../game/sets/set_definition.js";
import ZFCSet from "../../game/sets/zfcset.js";

import View from "../view.js";
import { newText } from "../text.js";
import Button from "../button.js";
import EmptyPowerPane from "./empty_power_pane.js";
import NestingPowerPane from "./nesting_power_pane.js";
import PairingPowerPane from "./pairing_power_pane.js";
import UnionPowerPane from "./union_power_pane.js";

const W = 560;
const H = 560;

type DiscoverCallback = (set: ZFCSet) => void;

export default class ActionPane extends View {
  discoverCallbacks: DiscoverCallback[] = [];
  private activePane: EmptyPowerPane|NestingPowerPane|PairingPowerPane|UnionPowerPane = new EmptyPowerPane();

  constructor() {
    super();
    this.showEmptyPower();
  }

  public showEmptyPower() {
    this.remove(this.activePane);
    this.activePane = new EmptyPowerPane();
    this.activePane.onClick(() => {
      for (let cb of this.discoverCallbacks) {
        cb(ZFCSet.getSet(SetDefinition.empty()));
      }
    });
    this.add(this.activePane);
  }

  public showNestingPower() {
    this.remove(this.activePane);
    this.activePane = new NestingPowerPane();
    this.activePane.onClick((set: ZFCSet) => {
      for (let cb of this.discoverCallbacks) {
        cb(set);
      }
    });
    this.add(this.activePane);
  }

  public showPairingPower() {
    this.remove(this.activePane);
    this.activePane = new PairingPowerPane();
    this.activePane.onClick((set: ZFCSet) => {
      for (let cb of this.discoverCallbacks) {
        cb(set);
      }
    });
    this.add(this.activePane);
  }

  public showUnionPower() {
    this.remove(this.activePane);
    this.activePane = new UnionPowerPane();
    this.activePane.onClick((set: ZFCSet) => {
      for (let cb of this.discoverCallbacks) {
        cb(set);
      }
    });
    this.add(this.activePane);
  }

  public onDiscover(callback: DiscoverCallback) {
    this.discoverCallbacks.push(callback);
  }

  public select(selection: ZFCSet) {
    if (this.activePane instanceof NestingPowerPane) {
      this.activePane.setSelection(selection);
    } else if (this.activePane instanceof PairingPowerPane) {
      this.activePane.setSelection(selection);
    }  else if (this.activePane instanceof UnionPowerPane) {
      this.activePane.setSelection(selection);
    }
  }
}
