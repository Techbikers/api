import { combineReducers } from "redux"
import { routerReducer } from "react-router-redux"

import auth from "techbikers/auth/reducers";
import entities from "techbikers/reducers/entities";
import errors from "./errors";
import page from "./page";
import oAuth from "./oAuth";

export default combineReducers({
  auth,
  entities,
  errors,
  page,
  oAuth,
  routing: routerReducer
})
