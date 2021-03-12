import type * as pixijs from "pixi.js";

import { newText } from "./ui/text.js"
import Collection from "./ui/collection.js"
import RightPane from "./ui/right_pane.js"
import ZFCSet from "./game/zfcset.js"

const app = new PIXI.Application({width: 1280, height: 720});
app.renderer.backgroundColor = 0xFFFFFF;
document.body.getElementsByTagName('main').item(0)!.appendChild(app.view);
app.view.onselectstart = function () { return false; }

const p = ZFCSet.pair(ZFCSet.EMPTY);
const p1 = ZFCSet.pair(p);
const p2 = ZFCSet.pair(p1);
const p3 = ZFCSet.pair(p2);
const pp1 = ZFCSet.pair(p);
const pp2 = ZFCSet.pair(ZFCSet.EMPTY, pp1);
const pp3 = ZFCSet.pair(ZFCSet.EMPTY, pp2);
const pp4 = ZFCSet.pair(ZFCSet.EMPTY, pp3);
const pp5 = ZFCSet.pair(pp4, pp3);

const c = new Collection();
const divider: PIXI.Graphics = new PIXI.Graphics();
divider.lineStyle(1, 0x000000, 1);
divider.moveTo(720, 0);
divider.lineTo(720, 720);

// c.discoverSet(p);
c.x = 0;
c.y = 0;

const r = new RightPane();
r.x = 720;
r.onDiscover((set: ZFCSet) => {
  c.discoverSet(set);
});

c.onSelect((set: ZFCSet) => {
  r.select(set);
});

app.stage.addChild(c.container);
app.stage.addChild(r.container);
app.stage.addChild(divider);

// c.discoverSet(pp1);
// c.discoverSet(pp2);
// c.discoverSet(pp3);



app.ticker.add(() => {

});
