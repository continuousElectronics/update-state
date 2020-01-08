# Update State

## Install

```bash
npm i update-state
```

## Philosphy

This is to attempt to forumlate a more generalized way to update application state that has simple syntax and eliminates having to write a lot of reducers.

The default export is a reducer function. The first argument is the previous state you wish to update, and the second argument is what we will define as an **updater object**. This should be an object that contains the data we want to update, and is the same shape as the state object. The goal is to be able to look at an updater object and easily deduce what it is updating since it takes on the same shape as the state object in order to work properly.

The updater object is traversed recursively and looks for matching keys until it can't go deeper. It then compares the values of the matching key structure with the following rules.

1. if Matching types of `Array` are found, the array entries from the updater are spread into the array from the previous state object

2. if Matching types of `Object` are found, the key value pairs from the updater are spread into the object from the previous state object.

3. if the updater object has a `Function` anywhere, it will be invoked with the following argument vector supplied

{
prevState: [previous state corresponding to whatever the value of the matching key structure is],
map: [function with previous state bound to it. takes a function argument that will map over the previous state],
filter: [function with previous state bound to it. takes a function argument that will filter over the previous state],
reduce: [function with previous state bound to it. takes a function argument that will reduce over the previous state],
mapWithUpdater: [same as map, except now the value you return from the function you provide acts as an updater]
}

## Example with Redux

```js
import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import updateState from "update-state";
import { createActions } from "redux-actions";

const initState = {
  counter: 10,
  artists: {
    1: {
      name: "Meshuggah",
      albums: ["Koloss", "Chaosphere", "Nothing"]
    },
    2: {
      name: "Soundgarden",
      albums: ["Superunknown", "Down on the upside"]
    }
  }
};

// If you follow the pattern of using an updater object as the payload of your object,
// the below reducer could be the only redux reducer you have to write for your whole app.
const reducer = function(state, { payload }) {
  if (!payload) return state;
  return updateState(state, payload);
};

const store = createStore(reducer, initState, applyMiddleware(logger));

const actions = createActions({
  INCREMENT: (incAmount = 1) => ({
    counter: ({ prevState }) => prevState + incAmount
  }),
  DECREMENT: (decAmount = 1) => ({
    counter: ({ prevState }) => prevState - decAmount
  }),
  UPDATE_ARTISTS: updater => ({
    artists: ({ mapWithUpdater }) => mapWithUpdater(() => updater)
  }),
  ADD_ALBUM: (id, album) => ({
    artists: {
      [id]: { albums: [album] }
    }
  }),
  REMOVE_ARTIST: id => ({
    artists: ({ filter }) => filter((a, aid) => id != aid)
  })
});

store.dispatch(actions.increment(6)); // { counter: 16 }
store.dispatch(actions.decrement()); // { counter: 15 }
store.dispatch(actions.decrement(12)); // { counter: 3 }
store.dispatch(actions.addAlbum(1, "Obzen"));
// ...
// artists: {
//   1: {
//     name: "Meshuggah",
//     albums: ["Koloss", "Chaosphere", "Nothing"]
//   },
// ...

store.dispatch(actions.updateArtists({ favorite: true }));
// ...
// artists: {
//   1: {
//     ...
//     favorite: true
//   },
//   2: {
//     ...
//     favorite: true
//   }
// ...

store.dispatch(actions.removeArtist(2));
// {
//   counter: 10,
//   artists: {
//     1: {
//       name: "Meshuggah",
//       albums: ["Koloss", "Chaosphere", "Nothing"]
//     },
//     2: {
//       name: "Soundgarden",
//       albums: ["Superunknown", "Down on the upside"]
//     }
//   }
// }
```
