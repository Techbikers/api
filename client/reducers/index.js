import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import ui from "techbikers/reducers/ui";
import app from "techbikers/app/reducers";
import auth from "techbikers/auth/reducers";
import entities from "techbikers/reducers/entities";
import errors from "./errors";
import page from "./page";
import oAuth from "./oAuth";
import notifications from "techbikers/notifications/reducers";

export default combineReducers({
  app,
  auth,
  entities,
  errors,
  page,
  oAuth,
  routing: routerReducer,
  notifications,
  ui
});
