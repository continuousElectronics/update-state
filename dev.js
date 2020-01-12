import {
  isObjLiteral,
  isFunction,
  isArray,
  map,
  filter,
  reduce
} from "./lib/util";

export default function updateState(prevState, updater) {
  if (isObjLiteral(prevState) && isObjLiteral(updater)) {
    const nextState = map(
      (val, key) => updateState(prevState[key], val),
      updater
    );

    return { ...prevState, ...nextState };
  }
  if (isArray(prevState) && isArray(updater)) {
    return [...prevState, ...updater];
  }
  if (isFunction(updater)) {
    return updater(prevState);
  }
  return updater;
}

export { map, filter, reduce };

export function mapWithUpdater(fn, objOrArr) {
  return map(function(val, keyOrIdx) {
    return updateState(val, fn(val, keyOrIdx));
  }, objOrArr);
}
