import { createStore, applyMiddleware, compose } from "redux";
import logger from "redux-logger";
import { createActions } from "redux-actions";
import updateState, { mapWithUpdater, filter } from "../dev";

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

const updater = {
  account: {
    userInfo: { name: "new name" }
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
console.log(updated);
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
console.log(updatedAgain);
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
console.log(lastTime);
