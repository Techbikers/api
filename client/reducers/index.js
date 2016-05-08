import { combineReducers } from "redux"
import { routerReducer } from "react-router-redux"

import authentication from "./authentication"
import entities from "./entities";
import errors from "./errors";
import page from "./page";
import oAuth from "./oAuth";

export default combineReducers({
  authentication,
  entities,
  errors,
  page,
  oAuth,
  routing: routerReducer
})
