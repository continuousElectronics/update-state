# Update State

## Install

```bash
npm i update-state
```

## Philosphy

This is to attempt to forumlate a more generalized way to update application state that has simple syntax and eliminates having to write a lot of reducers.

## What it is

**Update State** is a reducer function. For simplicity, it is assumed for now that both arguments should be object literals. In this case the return value would also be an object.

**_Argument 1:_** The state you wish to update

**_Argument 2:_** What is defined as an **updater** (defined in next section)

**_Returns:_** The new state that us produced from the updater

## Definition of an **updater**

The updater should be an object that contains the data we want to update, and is the same shape as the state object. The goal is to be able to look at an updater and easily deduce which part of the state it aims to update as well as the payload that is being delivered.

example of an updater:

```js
const updater = {
  account: {
    userInfo: { name: "new name" }
  }
};
```

By looking at this object we should be able to see what the payload is (`{ name: "new name" }`) as well as where it sits on the state object.

## Simple Example Usage

Here are some examples of how the function can be used

```js
import updateState from "update-state";

const state = {
  account: {
    loginToken: "FH23h3cn2cSA3FDGr",
    userInfo: {
      id: 1,
      name: "me",
      favoriteNumbers: [4]
    }
  }
};

// "updater" is the object from the code block above this one
const updated = updateState(state, updater);

// without mutating the "state" object the "updated" object is now
// {
//   account: {
//     loginToken: "FH23h3cn2cSA3FDGr",
//     userInfo: {
//       id: 1,
//       name: "new name"
//     }
//   }
// }

// If we use array syntax on the updater it will spread in the values to the corresponding array on the state

const updatedAgain = updateState(updated, {
  account: {
    userInfo: {
      favoriteNumbers: [3, 2, 9]
    }
  }
});
// without mutating the "updated" object the "updatedAgain" object is now
// {
//   account: {
//     loginToken: "FH23h3cn2cSA3FDGr",
//     userInfo: {
//       id: 1,
//       name: "new name",
//       favoriteNumbers: [4, 3, 2, 9]
//     }
//   }
// }

// If we have a function anywhere on the updater, it will be invoked with the
// first and only argument being the item on the previous state, and the
// return value will relace the item on the previous state.
const lastTime = updateState(updatedAgain, {
  account: {
    userInfo: {
      favoriteNumbers: prevNums => prevNums.map(n => n + 1)
    }
  }
});

// without mutating the "updatedAgain" object the "lastTime" object is now
// {
//   account: {
//     loginToken: "FH23h3cn2cSA3FDGr",
//     userInfo: {
//       id: 1,
//       name: "new name",
//       favoriteNumbers: [5, 4, 3, 10]
//     }
//   }
// }
```

## Example with Redux

This example shows some usage of the named exports that this module has in addition to the default export. They are: `map`, `filter`, `reduce` and `mapWithUpdater`. They iterate either an object or an array and take the function as the first argument and the object or array as the second argument. `mapWithUpdater` calls the default export `updateState` internally on whatever you return from the function you pass it. This can be useful for example when looking to update an array of objects without wanting to use spread syntax. You just return an updater in your map function.

```js
import { createStore, applyMiddleware, compose } from "redux";
import logger from "redux-logger";
import { createActions } from "redux-actions";
import updateState, { mapWithUpdater, filter } from "update-state";

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
    counter: prevState => prevState + incAmount
  }),
  DECREMENT: (decAmount = 1) => ({
    counter: prevState => prevState - decAmount
  }),
  UPDATE_ARTISTS: updater => ({
    artists: prevState => mapWithUpdater(() => updater, prevState)
  }),
  ADD_ALBUM: (id, album) => ({
    artists: {
      [id]: { albums: [album] }
    }
  }),
  REMOVE_ARTIST: id => ({
    artists: prevState => filter((a, aid) => id != aid, prevState)
  })
});

const { dispatch } = store;
const { increment, decrement, addAlbum, updateArtists, removeArtist } = actions;

compose(dispatch, increment)(6);
compose(dispatch, decrement)();
compose(dispatch, decrement)(12);
compose(dispatch, addAlbum)(1, "Obzen");
// ...
// artists: {
//   1: {
//     name: "Meshuggah",
//     albums: ["Koloss", "Chaosphere", "Nothing", "Obzen"]
//   },
// ...

compose(dispatch, updateArtists)({ favorite: true });
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

compose(dispatch, removeArtist)(2);
// {
//   counter: 10,
//   artists: {
//     1: {
//       name: "Meshuggah",
//       albums: ["Koloss", "Chaosphere", "Nothing", "Obzen"]
//     }
//   }
// }
```
