import React, {
  useState, createContext
} from "react";
import updateState from "update-state";

const State = createContext(null);

const App = function () {
  let [state, setState] = useState({});
  setState = (updater) => updateState(state, updater);

  return (
    <State.Provider value = {{state, setState}}>
      <div>
        app
      </div>
    </State.Provider>
  )
}

export default function App;