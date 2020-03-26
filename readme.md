# Update State

## Install

```bash
npm i update-state
```

## Philosphy

This is to attempt to forumlate a more generalized way to update application state that has simple syntax and eliminates having to write a lot of reducers. The motivation behind creating this was to attempt to alleviate some complaints against redux, such as: "why do i have to change 4 files everytime i want to create an action?". In my opinion these complaints are not against redux itself but rather how a lot of people traditionally setup redux.

## Quick explanation and example usage with Redux

You setup a single reducer that takes as the payload an `updater`. This updater contains what you want to update and matches the shape of the state. When comparing your updater to the state the reducer will do the following:

- Any key value pairs on your updater are spread into the state.
- If the updater shape and state shape both have an array at any point, the array values from the updater will be spread into the array on the state.
- Anytime a function is encountered in the updater, it will be called with the first and only argument being the current value sitting on that point of the state. Whatever you return relaces the current value.

```js
import { createStore } from "redux";
import { createActions } from "redux-actions";
import updateState, { mapWithUpdater, map } from "update-state";
// There are also named exports: filter and reduce that work on both objects and arrays.
// There first argument is the function and second the object or array

const initState = {
  account: {
    loginToken: "FH23h3cn2cSA3FDGr",
    userInfo: {
      id: 1,
      name: "me",
      favoriteNumbers: [4],
      things: [{ id: 1 }, { id: 2 }]
    }
  }
};

// create one single reducer that will be used for all actions
const reducer = function(state, { payload }) {
  if (!payload) return state;
  return updateState(state, payload);
};

// create the store with our single reducer
const store = createStore(reducer, initState);
const { dispatch } = store;

// create actions with the help of redux-actions
const actions = createActions({
  UPDATE_TOKEN: loginToken => ({ account: { loginToken } }),
  ADD_FAVORITE_NUMS: favoriteNumbers => ({
    account: { userInfo: { favoriteNumbers } }
  }),
  INCREMENT_FAVORITE_NUMS: (incBy = 1) => ({
    account: {
      userInfo: {
        favoriteNumbers: nums => map(n => n + incBy, nums)
      }
    }
  }),
  // mapWithUpdater allows your return value to behave as an updater.
  UPDATE_THINGS: fn => ({
    account: {
      userInfo: {
        things: things => mapWithUpdater(fn, things)
      }
    }
  })
});

dispatch(actions.updateToken("newtoken"));
// state.account.loginToken is now "newtoken"

dispatch(actions.addFavoriteNums([3, 2, 9]));
// state.account.userInfo.favoriteNumbers is now [4, 3, 2, 9]

dispatch(actions.incrementFavoriteNums(2));
// state.account.userInfo.favoriteNumbers is now [6, 5, 4, 11]

dispatch(
  actions.updateThings(function(thing) {
    return {
      name: "thing " + thing.id
    };
  })
);
// state.account.userInfo.things is now
// [
//   {id: 1, name: "thing 1"},
//   {id: 2, name: "thing 2"}
// ]
```

## Deeper dive

### What it is

The default export of **Update State** is a reducer function. Both arguments and the return value can be of any type, but to start off it is easier to think of them as being plain objects.

**_Argument 1:_** The state you wish to update

**_Argument 2:_** What is defined as an **updater** (defined in next section)

**_Returns:_** The new state that us produced from the updater

### Definition of an **updater**

The updater should be an object that contains the data we want to update, and is the same shape as the state object. The goal is to be able to look at an updater and easily deduce which part of the state it aims to update as well as the payload that is being delivered.

example of an updater:

```js
const updater = {
  account: {
    userInfo: { name: "new name" }
  }
};
```

By looking at this object we should be able to see what the payload is (`{ name: "new name" }`) as well as where it sits on the state object. (`state.account.userInfo`)

### What it does

**Update State** will inspect the updater you pass to it and return a newly created / updated object. The below process is how the updater will be compared to the state and how the newly returned state will be generated and returned.

- Any key value pairs on your updater are spread into the state.
- If the updater shape and state shape both have an array at any point, the array values from the updater will be spread into the array on the state.
- Anytime a function is encountered in the updater, it will be called with the first and only argument being the current value sitting on that point of the state. Whatever you return relaces the current value.
