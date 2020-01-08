import {
  isObjLiteral,
  isFunction,
  isArray,
  map,
  filter,
  reduce
} from "./lib/util";

export { map, filter, reduce };

export function mapWithUpdater(fn, objOrArr) {
  return map(function(val, keyOrIdx) {
    return updateState(val, fn(val, keyOrIdx));
  }, objOrArr);
}

export default function updateState(prevState, updater) {
  if (isObjLiteral(prevState) && isObjLiteral(updater)) {
    const nextState = reduce(
      function(acc, updaterVal, key) {
        acc[key] = updateState(prevState[key], updaterVal);

        return acc;
      },
      updater,
      {}
    );

    return { ...prevState, ...nextState };
  }
  if (isArray(prevState) && isArray(updater)) {
    return [...prevState, ...updater];
  }
  if (isFunction(updater)) {
    return updater(getArg(prevState));
  }
  return updater;
}

function getArg(prevState) {
  const fnArg =
    isArray(prevState) || isObjLiteral(prevState) ? prevState : [prevState];

  return {
    prevState,
    map: f => map(f, fnArg),
    filter: f => filter(f, fnArg),
    reduce: (f, init) => reduce(f, fnArg, init),
    mapWithUpdater: (f, init) => mapWithUpdater(f, fnArg, init)
  };
}
