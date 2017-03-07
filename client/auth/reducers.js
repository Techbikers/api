import { combineReducers } from "redux";
import jwtDecode from "jwt-decode";

import {
  AUTHENTICATION_REQUEST,
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_FAILURE,
  LOGOUT,
  CLEAR_AUTHENTICATION_ERROR
} from "techbikers/auth/actions";
import { UNEXPECTED_UNAUTHORIZED_API_RESPONSE } from "techbikers/middleware/api";

export default combineReducers({
  state: authState,
  authDidFail,
  email,
  failureReason,
  token,
  claims
});

export function authState(state = "unauthenticated", action) {
  switch (action.type) {
    case AUTHENTICATION_REQUEST:
      return "authenticating";
    case AUTHENTICATION_SUCCESS:
      return "authenticated";
    case LOGOUT:
    case AUTHENTICATION_FAILURE:
    case UNEXPECTED_UNAUTHORIZED_API_RESPONSE:
      return "unauthenticated";
    default:
      return state;
  }
}

export function authDidFail(state = false, action) {
  switch (action.type) {
    case AUTHENTICATION_FAILURE:
      return true;
    case AUTHENTICATION_SUCCESS:
    case LOGOUT:
    case CLEAR_AUTHENTICATION_ERROR:
      return false;
    default:
      return state;
  }
}

export function email(state = null, action) {
  switch (action.type) {
    case AUTHENTICATION_SUCCESS:
      return action.email;
    case LOGOUT:
    case UNEXPECTED_UNAUTHORIZED_API_RESPONSE:
      return null;
    default:
      return state;
  }
}

export function failureReason(state = "", action) {
  switch (action.type) {
    case AUTHENTICATION_FAILURE:
      if (action.isNetworkError) {
        return "Unable to connect to Robin - check your connection and try again.";
      } else if (action.httpStatus === 401) {
        return "Incorrect username or password";
      }
      return "An unknown error occurred";
    case AUTHENTICATION_SUCCESS:
    case LOGOUT:
    case CLEAR_AUTHENTICATION_ERROR:
      return "";
    default:
      return state;
  }
}

export function token(state = null, action) {
  switch (action.type) {
    case AUTHENTICATION_SUCCESS:
      return action.response.token;
    case LOGOUT:
    case UNEXPECTED_UNAUTHORIZED_API_RESPONSE:
      return null;
    default:
      return state;
  }
}

export function claims(state = {}, action) {
  let newClaims, newToken;

  switch (action.type) {
    case AUTHENTICATION_SUCCESS:
      newToken = action.response.token;
      newClaims = jwtDecode(newToken);
      return normalizeClaims(newClaims);
    case LOGOUT:
    case UNEXPECTED_UNAUTHORIZED_API_RESPONSE:
      return {};
    default:
      return state;
  }
}

function normalizeClaims(newClaims) {
  const {
    user_id: userId,
    orig_iat: issuedTime,
    exp: expirationTime
  } = newClaims;

  return { userId, issuedTime, expirationTime };
}
