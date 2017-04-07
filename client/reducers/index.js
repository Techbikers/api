import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import ui from "techbikers/reducers/ui";
import app from "techbikers/app/reducers";
import auth from "techbikers/auth/reducers";
import entities from "techbikers/reducers/entities";
import errors from "./errors";
import page from "./page";
import notifications from "techbikers/notifications/reducers";
import rides from "techbikers/rides/reducers";

export default combineReducers({
  app,
  auth,
  entities,
  errors,
  page,
  rides,
  routing: routerReducer,
  notifications,
  ui
});
