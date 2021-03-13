import FOLFormula from "../folformula.js"
import SetDefinition, { SetDefinitionType } from "./set_definition.js"

const reverseMap: Map<string, ZFCSet> = new Map();
const sizeMap: Map<number, ZFCSet[]> = new Map();
const hasMap: Map<ZFCSet, ZFCSet[]> = new Map();
const setToId: Map<ZFCSet, number> = new Map();

function definitionToHash(d: SetDefinition): string {
  let hash = "";
  if (d.base1 !== null) {
    hash += setToId.get(d.base1)!;
  }
  hash += "-" + d.getType().toString() + "-";
  if (d.base2 !== null) {
    hash += setToId.get(d.base2)!;
  }
  if (d.formula !== null) {
    hash += d.formula;
  }
  return hash;
}

export default class ZFCSet {
  public definitions: SetDefinition[] = [];
  public finiteList: ZFCSet[]|undefined;

  public static getSet(definition: SetDefinition): ZFCSet {
    const definitionHash = definitionToHash(definition);
    // If this definition has already been used, just return the same set.
    if (reverseMap.has(definitionHash)) {
      return reverseMap.get(definitionHash)!
    }

    // Check if this definition produces a set already unlocked.
    let equivalentSet: ZFCSet|null = null;
    switch(definition.getType()) {
      case SetDefinitionType.EMPTY: {
        const possibilities = sizeMap.get(0) || [];
        if (possibilities.length > 0) {
          equivalentSet = possibilities[0];
        }
        break;
      }
      case SetDefinitionType.NEST: {
        const possibilities = sizeMap.get(1) || [];
        for (let s of possibilities) {
          if (s.finiteList![0] === definition.getBase1()) {
            equivalentSet = s;
            break;
          }
        }
        break;
      }
      case SetDefinitionType.PAIR: {
        if (definition.getBase1() === definition.getBase2()) {
          const possibilities = sizeMap.get(1) || [];
          for (let s of possibilities) {
            if (s.finiteList![0] === definition.getBase1()) {
              equivalentSet = s;
              break;
            }
          }
        } else {
          const possibilities = sizeMap.get(2) || [];
          for (let s of possibilities) {
            const a = s.finiteList![0];
            const b = s.finiteList![1];
            const x = definition.getBase1();
            const y = definition.getBase2();
            if ((a === x && b === y) || (a === y && b === x)) {
              equivalentSet = s;
              break;
            }
          }
        }
        break;
      }
      case SetDefinitionType.UNION: {
        const temp = new ZFCSet(definition);
        if (temp.finiteList === undefined) {
          throw new Error("Can only create unions of finite sets");
        }
        const possibilities = sizeMap.get(temp.finiteList.length) || [];
        for (let s of possibilities) {
          if (temp.hasSameElements(s)) {
            equivalentSet = s;
            break;
          }
        }
        break;
      }
      default:
        throw new Error("Cannot create set with definition of type " + definition.getType());
    }
    if (equivalentSet !== null) {
      reverseMap.set(definitionHash, equivalentSet);
      equivalentSet.definitions.push(definition);
      return equivalentSet;
    }

    // Create and add set to indices;
    const set = new ZFCSet(definition);
    const id = setToId.size;
    setToId.set(set, id);
    reverseMap.set(definitionHash, set);
    if (set.finiteList !== undefined) {
      const size = set.finiteList.length;
      if (!sizeMap.has(size)) {
        sizeMap.set(size, []);
      }
      sizeMap.get(size)!.push(set);
    }
    return set;
  }

  private constructor(definition: SetDefinition) {
    this.definitions.push(definition);
    switch(definition.getType()) {
      case SetDefinitionType.EMPTY:
        this.finiteList = [];
        break;
      case SetDefinitionType.NEST:
        this.finiteList = [definition.getBase1()];
        break;
      case SetDefinitionType.PAIR:
        const b1 = definition.getBase1();
        const b2 = definition.getBase2();
        if (b1 === b2) {
          this.finiteList = [b1];
        } else {
          this.finiteList = [definition.getBase1(), definition.getBase2()].sort(ZFCSet.order);
        }
        break;
      case SetDefinitionType.UNION:
        const base = definition.getBase1();
        if (base.finiteList === undefined) {
          throw new Error("Can only create unions of finite sets");
        }
        const s: Set<ZFCSet> = new Set();
        for (let e of base.finiteList) {
          if (e.finiteList === undefined) {
            throw new Error("Can only create unions of finite sets of finite sets");
          }
          for (let ee of e.finiteList) {
            s.add(ee);
          }
        }
        this.finiteList = Array.from(s).sort(ZFCSet.order);
        break;
      default:
        throw new Error("Cannot create set with definition of type " + definition.getType());
    }
  }

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

  public static nest(set: ZFCSet): ZFCSet {
    return ZFCSet.getSet(SetDefinition.nest(set));
  }

  public static pair(a: ZFCSet, b:ZFCSet): ZFCSet {
    return ZFCSet.getSet(SetDefinition.pair(a, b));
  }

  public static union(set: ZFCSet): ZFCSet {
    return ZFCSet.getSet(SetDefinition.union(set));
  }

  public static succ(set: ZFCSet): ZFCSet {
    const n = ZFCSet.nest(set);
    const p = ZFCSet.pair(set, n);
    return ZFCSet.union(p);
  }

  public getId(): number {
    return setToId.get(this)!;
  }

  public isElement(set: ZFCSet): boolean|undefined {
    if (this.finiteList !== undefined) {
      return this.finiteList.indexOf(set) !== -1;
    }
    return undefined;
  }

  public hasSameElements(set: ZFCSet): boolean {
    if (this.finiteList === undefined || set.finiteList === undefined) {
      throw Error("Only works for sets with finite lists");
    }
    for (let e of this.finiteList) {
      if (set.finiteList.indexOf(e) == -1) {
        return false;
      }
    }
    return true;
  }

}
