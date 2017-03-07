import { compose, createStore, applyMiddleware } from "redux";
import persistState from "redux-localstorage";
import thunkMiddleware from "redux-thunk";
import { browserHistory } from "react-router";
import { routerMiddleware } from "react-router-redux";
import { createTracker } from "redux-segment";
import createSagaMiddleware, { END } from "redux-saga";

import apiMiddleware from "techbikers/middleware/api";
import ravenMiddleware from "techbikers/middleware/raven";
import rootReducer from "techbikers/reducers";

export default function configureStore(initialState = {}, sagas = []) {
  const trackerMiddleware = createTracker();
  const sagaMiddleware = createSagaMiddleware();

  const authenticationSlicer = () => state => {
    const { state: authState } = state.auth;

    if (authState === "authenticated") {
      return {
        auth: state.auth
      };
    } else {
      return {};
    }
  };

  const enhancer = compose(
    persistState(null, {
      slicer: authenticationSlicer
    }),
    applyMiddleware(
      apiMiddleware,
      ravenMiddleware,
      thunkMiddleware,
      routerMiddleware(browserHistory),
      trackerMiddleware,
      sagaMiddleware
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  );

  const store = createStore(rootReducer, initialState, enhancer);

  // Run each of the sagas
  sagas.forEach(saga => sagaMiddleware.run(saga));

  // Dispatch the END action when the store closed.
  // This will stop all running sagas
  store.close = () => store.dispatch(END);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("techbikers/reducers", () => {
      store.replaceReducer(require("techbikers/reducers").default);
    });
  }

  return store;
}
