import type * as pixijs from "pixi.js";

// Utility class to easily nest custom views within each other.

export default class View {
  protected children: View[] = [];
  public container = new PIXI.Container();
  public needsAnimation = false;

  get x(): number {
    return this.container.x ? this.container.x : 0;
  }

  set x(x: number) {
    this.container.x = x;
  }

  get y(): number {
    return this.container.y ? this.container.y : 0;
  }

  set y(y: number) {
    this.container.y = y;
  }

  public add(v: View) {
    this.children.push(v);
    this.container.addChild(v.container);
  }

  public tick(delta: number) {
    for (let v of this.children.filter(c => c.needsAnimation)) {
      v.tick(delta);
    }
  }
}
