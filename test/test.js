import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import { createActions } from "redux-actions";
import updateState, { mapWithUpdater, map } from "../dev";

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

// If you follow the pattern of using an updater object as the payload of your object,
// the below reducer could be the only redux reducer you have to write for your whole app.
const reducer = function(state, { payload }) {
  if (!payload) return state;
  return updateState(state, payload);
};

const store = createStore(reducer, initState, applyMiddleware(logger));
const { dispatch } = store;

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
