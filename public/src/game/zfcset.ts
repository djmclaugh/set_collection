import FOLFormula from "./folformula.js"
import {
  Definition,
  ExtensionalDefinition,
  SetBuilderDefinition,
  PowerSetDefinition,
  isExtensional,
  isSetBuilder,
  isPower,
} from "./set_definition.js"

export default class ZFCSet {
  public definition: Definition;

  public finiteList: ZFCSet[]|undefined;

  public static EMPTY: ZFCSet = new ZFCSet({
    elements: [],
  });

  public static order(a: ZFCSet, b:ZFCSet): number {
    if (a.finiteList !== undefined && b.finiteList !== undefined) {
      if (a.finiteList.length != b.finiteList.length) {
        return a.finiteList.length - b.finiteList.length;
      }
      for (let i = 0; i < a.finiteList.length; ++i) {
        const o = ZFCSet.order(a.finiteList[i], b.finiteList[i]);
        if (o != 0) {
          return 0;
        }
      }
      return 0;
    } else if (a.finiteList !== undefined) {
      return 1;
    } else if (b.finiteList !== undefined) {
      return -1;
    }
    return 0;
  }

  public static pair(a: ZFCSet, b?:ZFCSet): ZFCSet {
    if (b === undefined) {
      return new ZFCSet({
        elements: [a],
      });
    }
    return new ZFCSet({
      elements: [a, b],
    });
  }

  constructor(definition: Definition) {
    this.definition = definition;
    this.generateFiniteListIfPossible();
    this.orderFiniteListIfPossible();
  }

  private generateFiniteListIfPossible() {
    if (isExtensional(this.definition)) {
      this.finiteList = this.definition.elements.concat();
    } else if (isSetBuilder(this.definition)) {
      if (this.definition.superset.finiteList !== undefined) {
        const filter = this.definition.filter;
        let keepers: ZFCSet[] = [];
        let foundUndefined = false;
        for (let e of this.definition.superset.finiteList) {
          const satisfies = filter.evaluate(e);
          if (satisfies === true) {
            keepers.push(e);
          } else if (satisfies === undefined) {
            foundUndefined = true;
            break;
          }
        }
        if (!foundUndefined) {
          this.finiteList = keepers;
        }
      }
    } else if (isPower(this.definition)) {
      if (this.definition.baseSet.finiteList !== undefined) {
        const list = this.definition.baseSet.finiteList;
        const elements: ZFCSet[] = [];
        for (let i = 0; i < Math.pow(2, list.length); ++i) {
          const subset: Set<ZFCSet> = new Set();
          let count = i;
          for (let j = 0; j < list.length; ++j) {
            if (count % 2 == 1) {
              subset.add(list[j]);
            }
            count = Math.floor(count / 2);
          }
        }
        this.finiteList = elements;
      }
    } else {
      throw Error("Invalid definition");
    }
  }

  private orderFiniteListIfPossible() {
    if (this.finiteList === undefined) {
      return;
    }
    const simplified: ZFCSet[] = [];
    // Remove duplicates
    for (let s of this.finiteList) {
      let foundSame = false;
      for (let alreadyAdded of simplified) {
        if (alreadyAdded.equals(s)) {
          foundSame = true;
          break;
        }
      }
      if (!foundSame) {
        simplified.push(s);
      }
    }
    this.finiteList = simplified.sort(ZFCSet.order);
  }

  public isFinite(): boolean|undefined {
    if (isExtensional(this.definition)) {
      return true;
    } else if (isSetBuilder(this.definition)) {
      return this.definition.superset.isFinite() ? true : undefined;
    } else if (isPower(this.definition)) {
      return this.definition.baseSet.isFinite();
    }
    return undefined;
  }

  public getId(): string {
    if (this.finiteList === undefined) {
      throw Error("Can currently only give IDs to finite hieararchies of finite sets");
    }
    return "{" + this.finiteList.map(e => e.getId()).join(",") + "}";
  }

  public isElement(set: ZFCSet): boolean|undefined {
    if (isExtensional(this.definition)) {
      let foundUndefined = false;
      this.definition.elements.forEach(e => {
        const equals = e.equals(set);
        if (equals === true) {
          return true;
        }
        if (equals === undefined) {
          foundUndefined = true;
        }
      });
      return foundUndefined ? undefined : false;
    } else if (isSetBuilder(this.definition)) {
      const isElement = this.definition.superset.isElement(set);
      const satisfiesFilter = this.definition.filter.evaluate(set);
      if (isElement === true && satisfiesFilter === true) {
        return true;
      }
      if (isElement === false || satisfiesFilter === false) {
        return false;
      }
      return undefined;
    } else if (isPower(this.definition)) {
      if (set.finiteList !== undefined) {
        let foundUndefined = false;
        for (let e of set.finiteList) {
          const isInBase = this.definition.baseSet.isElement(e);
          if (isInBase === false) {
            return false;
          } else if (isInBase === undefined) {
            foundUndefined = true;
          }
        }
        return foundUndefined ? undefined : true;
      }
    }
    return undefined;
  }

  public equals(set: ZFCSet): boolean|undefined {
    if (this.finiteList !== undefined && set.finiteList !== undefined) {
      return this.getId() == set.getId();
    }
    return undefined;
  }


}
