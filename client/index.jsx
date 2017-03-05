import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router, browserHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";

import routes from "techbikers/routes";
import configureStore from "techbikers/store";
import { init } from "techbikers/app/actions";
import chapterSagas from "techbikers/chapters/sagas";
import rideSagas from "techbikers/rides/sagas";

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

const sagas = [
  chapterSagas,
  rideSagas
];

const store = configureStore(initialState, sagas);
const history = syncHistoryWithStore(browserHistory, store);

// Dispatch an init event to know the app is ready
store.dispatch(init());

if (!global.Intl) {
  require.ensure(["intl", "intl/locale-data/jsonp/en.js"], require => {
    require("intl");
    require("intl/locale-data/jsonp/en.js");
    renderApp();
  });
} else {
  renderApp();
}

function renderApp() {
  render(
    <Provider store={store}>
      <Router history={history} children={routes} />
    </Provider>,
    document.getElementById("app")
  );
}
