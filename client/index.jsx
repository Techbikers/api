import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router, browserHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";

import routes from "./routes";
import configureStore from "./store"
import { init } from "./actions/init"

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

store.dispatch(init())

if (!global.Intl) {
  require.ensure(["intl", "intl/locale-data/jsonp/en.js"], (require) => {
    require("intl");
    require("intl/locale-data/jsonp/en.js");
    renderApp();
  });
} else {
  renderApp()
}

function renderApp() {
  render(
    <Provider store={store}>
      <Router history={history} children={routes} />
    </Provider>,
    document.getElementById('app')
  )
}
