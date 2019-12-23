module.exports = update;

function update(prevState, schemaObj) {
  if (isObject(prevState) && isObject(schemaObj)) {
    let nextState = {};

    for (let key in schemaObj) {
      nextState = {
        ...nextState,
        [key]: update(prevState[key], schemaObj[key])
      }
    }

    return {...prevState, ...nextState};
  }
  if (isArray(prevState) && isArray(schemaObj)) {
    return [...prevState, ...schemaObj];
  }
  if (isFunction(schemaObj)) {
    return schemaObj(prevState);
  }
  return schemaObj;
}

function isObject(o) {
  return Object.prototype.toString.call(o) === "[object Object]" &&
    typeof o === "object";
}

function isArray(a) {
  return Array.isArray(a);
}

function isFunction(fn) {
  return typeof fn === "function";
}
