import { takeEvery, call, fork, put } from "redux-saga/effects";

import { callApi } from "techbikers/utils/api";
import { createTextNotification } from "techbikers/notifications/actions";
import * as actions from "techbikers/auth/actions";
import * as ui from "techbikers/auth/actions/ui";

/**
 * Fetch a single user by their ID
 * @param {number} payload - User ID
 */
export function* authenticateUser({ payload }) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: payload.email,
      password: payload.password
    })
  };
  // Make the call to the API
  const { error, response } = yield call(callApi, "/auth/token", fetchOptions);

  if (error) {
    // Authentication failed
    yield put(actions.authFailure(error));
  } else {
    // Authenticated successful, log the user in on the client
    yield put(actions.authSuccess(response));
  }
}

/**
 * Pass the payload of the auth response to the handler function
 * @param  {Object} payload - Action payload from
 */
export function* authenticationCallback({ payload }) {
  yield put(actions.authSuccess({ token: payload }));
}

/**
 * Refresh the authentication token
 * @param  {string} payload - Current auth token
 */
export function* refreshToken({ payload }) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload })
  };
  // Attempt to refresh the token
  const response = yield call(callApi, "/auth/token/refresh", fetchOptions);
  // Send the response to the callback function
  yield call(authenticationCallback, response);

  return response;
}

/**
 * Exchange the OAuth response for an auth token
 * @param {Object} payload
 * @param {string} payload.backend - The auth backend used
 * @param {string} payload.code    - The code returned by the provider
 * @param {string} payload.state   - The state returned by the provider
 */
export function* exchangeToken({ payload }) {
  const fetchOptions = {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  };
  // Attempt to exchange the token
  const response = yield call(callApi, "/auth/token/exchange", fetchOptions);
  // Send the response to the callback function
  yield call(authenticationCallback, response);

  return response;
}

/**
 * Change the password (knowing the current one)
 * @param {Object} payload
 * @param {string} payload.email         - Users email address
 * @param {string} payload.password      - Users current password
 * @param {string} payload.new_password1 - New password
 * @param {string} payload.new_password2 - New password confirmation
 */
export function* changePassword({ payload }) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  };
  return yield call(callApi, "/auth/password/change", fetchOptions);
}

/**
 * Start the process of resetting a password by sending a reset email
 * @param {string} payload - Email address
 */
export function* beginPasswordReset({ payload }) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: payload })
  };
  const { error } = yield call(callApi, "/auth/password/reset", fetchOptions);

  if (!error) {
    yield put(ui.updatePasswordResetStatus("emailed"));
  }
}

/**
 * Reset the password using the token that the user has been given
 * @param {Object} payload
 * @param {number} payload.id            - User ID
 * @param {string} payload.token         - Token allowing the user to reset the password
 * @param {string} payload.new_password1 - New password
 * @param {string} payload.new_password2 - New password confirmation
 */
export function* finishPasswordReset({ payload }) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  };

  // Attempt to reset the password
  const { error, response } = yield call(callApi, "/auth/password/reset/confirm", fetchOptions);

  if (!error) {
    // Log the user in
    yield [
      put(actions.authenticateUser(response.email, payload.new_password1)),
      put(createTextNotification("Your password has been changed"))
    ];
  }
}

export function* logout() {
  yield put(createTextNotification("You have successfully logged out!"));
}

export default function* root() {
  yield [
    fork(takeEvery, actions.AUTHENTICATE_USER, authenticateUser),
    fork(takeEvery, actions.AUTHENTICATION_CALLBACK, authenticationCallback),
    fork(takeEvery, actions.REFRESH_TOKEN, refreshToken),
    fork(takeEvery, actions.BEGIN_PASSWORD_RESET, beginPasswordReset),
    fork(takeEvery, actions.FINISH_PASSWORD_RESET, finishPasswordReset),
    fork(takeEvery, actions.LOGOUT, logout)
  ];
}
