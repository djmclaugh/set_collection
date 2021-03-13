import FOLFormula from "../folformula.js"
import ZFCSet from "./zfcset.js"

export enum SetDefinitionType {
  EMPTY,
  NEST,
  PAIR,
  UNION,
  INFINITY,
  SET_BUILDER,
  REPLACEMENT,
  POWER,
}

function sameOrBothNull(a: ZFCSet|null, b: ZFCSet|null): boolean|undefined {
  if (a === null && b === null) {
    return true;
  } else if (a !== null && b !== null) {
    return a === b;
  }
  return false;
}

function formulaIsSameOrBothNull(a: FOLFormula|null, b: FOLFormula|null): boolean {
  if (a === null && b === null) {
    return true;
  } else if (a !== null && b !== null) {
    return a == b;
  }
  return false;
}

export default class SetDefinition {
  private type: SetDefinitionType;
  public base1: ZFCSet|null = null;
  public base2: ZFCSet|null = null;
  public formula: FOLFormula|null = null;

  constructor(type: SetDefinitionType) {
    this.type = type;
  }

  public static empty(): SetDefinition {
    return new SetDefinition(SetDefinitionType.EMPTY);
  }
  public static nest(s: ZFCSet): SetDefinition {
    const d = new SetDefinition(SetDefinitionType.NEST);
    d.base1 = s;
    return d;
  }
  public static pair(s1: ZFCSet, s2: ZFCSet): SetDefinition {
    const d = new SetDefinition(SetDefinitionType.PAIR);
    d.base1 = s1;
    d.base2 = s2;
    return d;
  }
  public static union(s: ZFCSet): SetDefinition {
    const d = new SetDefinition(SetDefinitionType.UNION);
    d.base1 = s;
    return d;
  }

  public getType(): SetDefinitionType {
    return this.type;
  }

  public getBase1(): ZFCSet {
    if (this.base1 === null) {
      throw new Error("Definition doesn't have base1.");
    }
    return this.base1;
  }

  public getBase2(): ZFCSet {
    if (this.base2 === null) {
      throw new Error("Definition doesn't have base1.");
    }
    return this.base2;
  }

  public equals(d: SetDefinition): boolean|undefined {
    if (this.type != d.type) {
      return false;
    }
    const base1Same = sameOrBothNull(this.base1, d.base1);
    if (base1Same === false) {
      return false;
    }
    const base2Same = sameOrBothNull(this.base2, d.base2);
    if (base2Same === false) {
      return false;
    }
    const formulaSame = formulaIsSameOrBothNull(this.formula, d.formula);
    if (formulaSame === false) {
      return false;
    }
    if (base1Same === undefined || base2Same === undefined) {
      return undefined;
    }
    return true;
  }


}
