// Generalized map, filter and reduce functions that work on both objects and arrays
export function map(fn, item) {
  const err = fnHasErr(fn, item, "map");

  if (err) throw new Error(err);
  if (isObjLiteral(item)) return mapObj(fn, item);
  if (isArray(item)) return mapArr(fn, item);
}

export function filter(fn, item) {
  const err = fnHasErr(fn, item, "filter");

  if (err) throw new Error(err);
  if (isObjLiteral(item)) return filterObj(fn, item);
  if (isArray(item)) return filterArr(fn, item);
}

export function reduce(fn, item, init) {
  const err = fnHasErr(fn, item, "reduce");

  if (err) throw new Error(err);
  if (isObjLiteral(item)) return reduceObj(fn, item, init);
  if (isArray(item)) return reduceArr(fn, item, init);
}

export function isArray(a){
  return Array.isArray(a);
}

export function isFunction(f){
  return typeof f === "function";
}

export function isObjLiteral(o){
  return typeofObject(o) && hasObjectProto(o);
}

////////////////////////////////////////////////////////////////
// Private
////////////////////////////////////////////////////////////////
function fnHasErr(fn, item, fnName) {
  if (!isFunction(fn)) {
    return `the first argument of ${fnName} must be a function`;
  }
  if (!isObjLiteral(item) && !isArray(item)) {
    return `the second argument of ${fnName} must be a plain object or an array`;
  }
  return false;
}

function typeofObject(o) {
  return typeof o === "object";
}

function hasObjectProto(o) {
  return Object.getPrototypeOf(o) === Object.prototype;
}

function keys(o) {
  return Object.keys(o);
}

// Iterating objects with map, filter and reduce
function mapObj(fn, obj) {
  let mapped = {};

  keys(obj).forEach(function (key) {
    mapped[key] = fn(obj[key], key);
  });

  return mapped;
}

function filterObj(fn, obj) {
  let filtered = {};

  keys(obj).forEach(function (key) {
    if (fn(obj[key], key)) {
      filtered[key] = obj[key];
    }
  });

  return filtered;
}

function reduceObj(fn, obj, init) {
  return keys(obj).reduce(
    (acc, key) => fn(acc, obj[key], key), init
  );
}  

// Iterating arrays with map, filter and reduce. (aliasing Array methods witout 3rd arg)
function mapArr(fn, arr) {
  return arr.map(
    (val, idx) => fn(val, idx)
  );
} 

function filterArr(fn, arr) {
  return arr.filter(
    (val, idx) => fn(val, idx)
  );
}

function reduceArr(fn, arr, init) {
  return arr.reduce(
    (acc, val, idx) => fn(acc, val, idx), init
  );
} 