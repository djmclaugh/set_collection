import type * as pixijs from "pixi.js";

import View from "./view.js";
import { newText } from "./text.js";
import ZFCSet from "../game/sets/zfcset.js";
import { SetDefinitionType } from "../game/sets/set_definition.js";

type SetCallback = (set: ZFCSet) => void;

export default class SetView extends View {
  private callbacks: SetCallback[] = [];
  private set: ZFCSet;
  private background: PIXI.Graphics = new PIXI.Graphics();
  private selected: boolean = false;
  private originalWidth: number;
  private interactiable: boolean = false;
  private elementViews: SetView[] = [];

  constructor(set: ZFCSet) {
    super();
    this.set = set;
    this.container.addChild(this.background);
    if (set.finiteList !== undefined) {
      const l = newText("{", 60);
      const r = newText("}", 60);
      let x = 0;
      l.x = x;
      this.container.addChild(l);
      x += l.width + 2;
      this.container.addChild(r);
      for (let s of set.finiteList) {
        const sv = new SetView(s);
        sv.container.scale.x = 0.8;
        sv.container.scale.y = 0.8;
        sv.x = x;
        sv.y = (this.container.height - sv.container.height) / 2;
        this.add(sv);
        x += sv.container.width + 16;
        this.elementViews.push(sv);
      }
      if (set.finiteList.length > 0) {
        x -= 14;
      }
      r.x = x;
      this.container.addChild(r);
    } else {
      throw new Error("Can currently only display extensionaly defined sets");
    }

    this.originalWidth = this.container.width;
    this.container.hitArea = new PIXI.Rectangle(-9, -1, this.originalWidth + 18, 80)

  }

  public select(selected: boolean) {
    this.selected = selected;
    if (!this.selected) {
      this.background.clear();
    } else {
      this.background.clear();
      this.background.beginFill(0xFFFF00, 0.05);
      this.background.lineStyle(2, 0x000000, 0.5);
      this.background.drawRect(-9, 0, this.originalWidth + 16, 78);
    }
  }

  public setInteractiable() {
    this.container.interactive = true;
    this.container.on("click", () => {
      for (let cb of this.callbacks) {
        cb(this.set);
      }
    });
    this.container.on("pointerover", () => {
      this.select(true);
    });
    this.container.on("pointerout", () => {
      this.select(false);
    });
  }

  public setChildrenInteractable() {
    this.container.interactive = true;
    for (let sv of this.elementViews) {
      sv.setInteractiable();
    }
    // There is a bug
    // https://github.com/pixijs/pixi.js/issues/6614
    this.container.on("pointerout", () => {
      for (let sv of this.elementViews) {
        sv.select(false);
      }
    });
  }

  public unselect() {
    this.select(false);
    for (let sv of this.elementViews) {
      sv.select(false);
    }
  }

  public xCenter() {
    return this.originalWidth / 2;
  }

  public onSelect(cb: SetCallback) {
    this.callbacks.push(cb);
  }
}
