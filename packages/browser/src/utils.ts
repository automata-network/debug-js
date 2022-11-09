export function getObjName(a: any) {
  return Object.prototype.toString.call(a);
}

export function isError(a: any) {
  if (!isObject(a)) return false;
  const objName = getObjName(a);
  return (
    "[object Error]" === objName ||
    "[object DOMException]" === objName ||
    (isString(a.name) && isString(a.message))
  );
}

export function isElement(a: any) {
  return isObject(a) && 1 === a.nodeType;
}

export function isFunction(a: any) {
  return !(!a || typeof a !== "function");
}

export function isNumber(a: any) {
  return (
    "number" === typeof a ||
    (isObject(a) && "[object Number]" === getObjName(a))
  );
}

export function isObject(a: any) {
  return !(!a || "object" !== typeof a);
}

export function isString(a: any) {
  return (
    "string" === typeof a ||
    (!isArray(a) && isObject(a) && "[object String]" === getObjName(a))
  );
}

export function isArray(a: any) {
  return "[object Array]" === getObjName(a);
}

export function isBoolean(a: any) {
  return (
    "boolean" === typeof a ||
    (isObject(a) && "[object Boolean]" === getObjName(a))
  );
}

function elementToString(a: any) {
  var d = "<" + a.tagName.toLowerCase();
  a = a.attributes || [];
  for (var b = 0; b < a.length; b++)
    d += " " + a[b].name + '="' + a[b].value + '"';
  return d + ">";
}

function buildErrorObj(a: any) {
  return {
    name: a.name,
    message: a.message,
    stack: a.stack,
    line: a.line,
    column: a.column,
  };
}

export function serialize(a: any) {
  if (a === "") return "Empty String";
  if (a === undefined) return "undefined";
  if (isString(a) || isNumber(a) || isBoolean(a) || isFunction(a)) {
    return "" + a;
  }
  if (isElement(a)) return elementToString(a);
  if ("symbol" === typeof a) return Symbol.prototype.toString.call(a);
  if (isError(a)) {
    return JSON.stringify(buildErrorObj(a));
  }

  let jsonString;
  try {
    jsonString = JSON.stringify(a, function (a, d) {
      return d === undefined
        ? "undefined"
        : isNumber(d) && isNaN(d)
        ? "NaN"
        : isError(d)
        ? buildErrorObj(d)
        : isElement(d)
        ? elementToString(d)
        : d;
    });
  } catch (e) {
    jsonString = "";
    for (let e in a)
      if (a.hasOwnProperty(e))
        try {
          jsonString += ',"' + e + '":"' + a[e] + '"';
        } catch (h) {}
    jsonString = jsonString
      ? "{" + jsonString.replace(",", "") + "}"
      : "Unserializable Object";
  }

  return jsonString
    .replace(/"undefined"/g, "undefined")
    .replace(/"NaN"/g, "NaN");
}

export function tryGet(a: any, b: string) {
  try {
    return a[b];
  } catch (c) {}
}
