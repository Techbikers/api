import { combineReducers } from "redux";
import jwtDecode from "jwt-decode";
import { camelizeKeys } from "humps";

import {
  AUTHENTICATE_USER,
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_FAILURE,
  LOGOUT
} from "techbikers/auth/actions";

export default combineReducers({
  state: authState,
  token,
  claims
});

export function authState(state = "unauthenticated", { type }) {
  switch (type) {
    case AUTHENTICATE_USER:
      return "authenticating";
    case AUTHENTICATION_SUCCESS:
      return "authenticated";
    case LOGOUT:
    case AUTHENTICATION_FAILURE:
      return "unauthenticated";
    default:
      return state;
  }
}

export function token(state = null, { type, payload }) {
  switch (type) {
    case AUTHENTICATION_SUCCESS:
      return payload.token;
    case LOGOUT:
      return null;
    default:
      return state;
  }
}

export function claims(state = {}, { type, payload }) {
  switch (type) {
    case AUTHENTICATION_SUCCESS:
      return camelizeKeys(jwtDecode(payload.token));
    case LOGOUT:
      return {};
    default:
      return state;
  }
}
