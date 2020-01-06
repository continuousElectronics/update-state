# Update State

## Install

```bash
npm i update-state
```

## Philosphy

This is to attempt to forumlate a more generalized way to update application state that has simple syntax and eliminates having to write and / or combine a lot of reducer functions and action creators.

The basic idea is that we describe how we want to update our state with something we will define called an __updater object__. This should be an object that contains the data we want to update, and is the same shape as the state object. The goal is to be able to look at an updater object and easily deduce what it is updating since it needs takes on the same shape as the state object in order to work properly.

Below are some examples with Redux. See How it works for more details.

## Simple Example with Redux

There are 2 exports for redux being shown in the example below. Here were are using redux with one single reducer and one action creator (neither of which we had to even write)

```js
import {createStore, compose} from "redux";
import {reduxReducer, reduxUpdate} from "update-state";

const initState = {
  menu: {
    open: false,
    items: [
      {href: "/about", name: "About"},
      {href: "/home", name: "home"}
    ]
  },
};

const store = createStore(reduxReducer, initState);
const updateState = compose(store.dispatch, reduxUpdate);

// example of opening the menu
updateState({ menu: {open: true} });
// state is now
// {
//   menu: {
//     open: true,
//     items: [
//       {href: "/about", name: "About"},
//       {href: "/home", name: "Home"}
//     ]
//   }
// }

// example making appState busy.
updateState({
  appState: { busy: true }
});
// state is now
// {
//   appState: { busy: true },
//   menu: {
//     open: true,
//     items: [
//       {href: "/about", name: "About"},
//       {href: "/home", name: "Home"}
//     ]
//   }
// }

// example of updating the menu item names
// if the item on the updater object is a function and is an array on the state object,
// we can can use the built in map function and only have to return another updater object for each array item
// filter and reduce work the same as the regulary JS Array methods.
// they are being proxied since a copy of the array 
updateState({
  menu: {
    items: ({map}) => map(function (item) {
      // it will not stop you from mutating the `item` argument here, but you shouldn't since you are using redux.
      // allowing you to return an updater object to map each item is to alleviate spread syntax,
      // which can get tedious espeically when updating deeper levels of an objects
      return {
        name: item.name + " Page"
      }
    })
  }
});
// state is now
// {
//   appState: { busy: true },
//   menu: {
//     open: true,
//     items: [
//       {href: "/about", name: "About Page"},
//       {href: "/home", name: "Home Page"}
//     ]
//   }
// }

// example of adding a menu item
// since the values for the key items on both the updater object and the state are arrays,
// whatever items are in the updater object array are spread into the state
updateState({
  menu: {
    items: [
      {href: "/blog", name: "Blog Page"}
    ]
  }
});
// state is now
// {
//   appState: { busy: true },
//   menu: {
//     open: true,
//     items: [
//       {href: "/about", name: "About Page"},
//       {href: "/home", name: "Home Page"},
//       {href: "/blog", name: "Blog Page"}
//     ]
//   }
// }
```

`reduxReducer` is a simple redux reducer that has one case in a switch responding to the type `__UPDATE_STATE__`. It updates the state using the updater object you pass in corresponding to `action.updaterObject`

`reduxUpdate` is an action creator that takes the updaterObject as a single argument and returns `{type, updaterObject}` (which corresponds to the single case in the aforementioned reduxReducer)

## How it works

