import type * as pixijs from "pixi.js";

import ZFCSet from "../game/sets/zfcset.js";

import View from "./view.js";
import SetView from "./set_view.js";

const H = 720;
const W = 720;

type SetCallback = (set: ZFCSet) => void;

export default class Collection extends View {
  private callbacks: SetCallback[] = [];
  // Discovered sets in order of discovery.
  private discovered: number[] = [];
  private setViews: Map<number, SetView> = new Map();

  public discoverSet(set: ZFCSet) {
    const setID = set.getId();
    let alreadyDiscovered = (this.discovered.indexOf(setID) !== -1);
    if (alreadyDiscovered) {
      // Do nothing
    } else {
      this.discovered.push(setID);
      const v = new SetView(set);
      this.setViews.set(setID, v);
      v.setInteractiable();
      v.onSelect((set: ZFCSet) => {
        for (let cb of this.callbacks) {
          cb(set);
        }
      });
      this.add(v);
      this.reposition();
    }
  }

  public tick(delta: number) {
    super.tick(delta);
  }

  private reposition() {
    for (let i = 0; i < this.discovered.length; ++i) {
      const v = this.setViews.get(this.discovered[this.discovered.length - 1 - i])!;
      v.x = W/4 - v.xCenter();
      if (i % 2 == 1) {
        v.x += W/2;
      }
      v.y = 80 + 100 * Math.floor(i/2);
    }
  }

  public onSelect(cb: SetCallback) {
    this.callbacks.push(cb);
  }


}
