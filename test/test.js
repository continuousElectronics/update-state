import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import updateState from "../dev";
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
store.dispatch(actions.updateArtists({ favorite: true }));
store.dispatch(actions.removeArtist(2));
