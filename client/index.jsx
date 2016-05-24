import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router, browserHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";

import routes from "./routes";
import configureStore from "./store"
import { init } from "./actions/init"

const initialState = {
  page: {
    meta: {
      "og:image": "https://techbikers.com/static/images/techbikers_144px.png",
      "og:title": "Techbikers - Paris to London charity cycle ride",
      "og:url": "https://techbikers.com",
      "og:description": "On June 24th, 60+ techies will ride from Paris to London. Over the 3 day, 200 mile ride they will raise $75000+ for Room to Read."
    }
  }
};

const store = configureStore(initialState);
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
