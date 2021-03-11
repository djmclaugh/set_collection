import FOLFormula from "./folformula.js"
import ZFCSet from "./zfcset.js"

export type ExtensionalDefinition = {
  elements: ZFCSet[],
};
export type SetBuilderDefinition = {
  superset: ZFCSet,
  filter: FOLFormula,
};
export type PowerSetDefinition = {
  baseSet: ZFCSet;
};

export type Definition = ExtensionalDefinition|SetBuilderDefinition|PowerSetDefinition;

export function isExtensional(d: Definition): d is ExtensionalDefinition {
  if (typeof d !== "object") {
    return false;
  }
  let ed = (d as ExtensionalDefinition);
  if (ed.elements === undefined || !Array.isArray(ed.elements)) {
    return false;
  }
  return true;
}

export function isSetBuilder(d: Definition): d is SetBuilderDefinition {
  if (typeof d !== "object") {
    return false;
  }
  let sbd = (d as SetBuilderDefinition);
  if (sbd.superset === undefined || !(sbd.superset instanceof ZFCSet)) {
    return false;
  }
  if (sbd.filter === undefined || !(sbd.filter instanceof FOLFormula)) {
    return false;
  }
  return true;
}

export function isPower(d: Definition): d is PowerSetDefinition {
  if (typeof d !== "object") {
    return false;
  }
  let pd = (d as PowerSetDefinition);
  if (pd.baseSet === undefined || !(pd.baseSet instanceof ZFCSet)) {
    return false;
  }
  return true;
}

export function isSameDefinition(a: Definition, b: Definition): boolean {
  if (isExtensional(a) && isExtensional(b)) {
    if (a.elements.length !== b.elements.length) {
      return false;
    }
    for (let i = 0; i < a.elements.length; ++i) {
      if (!isSameDefinition(a.elements[i].definition, b.elements[i].definition)) {
        return false;
      }
    }
    return true;
  } else if (isSetBuilder(a) && isSetBuilder(b)) {
    return isSameDefinition(a.superset.definition, b.superset.definition) && a.filter == b.filter;
  } else if (isPower(a) && isPower(b)) {
    return isSameDefinition(a.baseSet.definition, b.baseSet.definition);
  }
  return false;
}
