import {
  isObjLiteral, isFunction, isArray,
  map, filter, reduce
} from "./lib/util";

export {map, filter, reduce};

export function mapWithUpdater(fn, objOrArr) {
  return map(function (val, keyOrIdx) {
    return updateState(val, fn(val, keyOrIdx));
  }, objOrArr);
}

export default function updateState(prevState, updater) {
  if (isObjLiteral(prevState) && isObjLiteral(updater)) {
    const nextState = reduce(function (acc, updaterVal, key) {
      acc[key] = updateState(prevState[key], updaterVal);

      return acc;
    }, updater, {});

    return {...prevState, ...nextState};
  }
  if (isArray(prevState) && isArray(updater)) {
    return [...prevState, ...updater];
  }
  if (isFunction(updater)) {
    return updater(
      prevState, {map, filter, reduce, mapWithUpdater}
    );
  }
  return updater;
}
