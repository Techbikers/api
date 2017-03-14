import moment from "moment";
import { takeEvery, fork, put, select, call } from "redux-saga/effects";

import { INIT } from "techbikers/app/actions";
import authService from "techbikers/auth/services";
import { createTextNotification } from "techbikers/notifications/actions";
import { fetchUserById } from "techbikers/users/actions";
import { getAuthState, getAuthenticatedUserId } from "techbikers/auth/selectors";
import * as actions from "techbikers/auth/actions";
import * as ui from "techbikers/auth/actions/ui";

/**
 * Runs on app initialisation to check the authentication state and
 * fetch any required user information (profile, refreshed token etc)
 */
export function* checkAuthState() {
  const { state, exp } = yield select(getAuthState);

  if (state === "authenticated") {
    // Check that the token is still valid
    if (moment().isAfter(exp * 1000)) {
      // Log the user out
      yield put(actions.logout());
    } else {
      // Update user information
      yield call(completeAuthentication);
    }
  }
}

/**
 * Authenticate the user with Auth0 using the Username-Password connection
 * @param {Object} payload
 * @param {string} payload.email
 * @param {string} payload.password
 */
export function* authenticateUser({ payload }) {
  const { error, response } = yield authService.login(payload.email, payload.password);

  if (error) {
    // Authentication failed
    yield put(actions.authFailure(error));
  } else {
    // Authenticated successful, log the user in on the client
    yield put(actions.authSuccess(response));
  }
}

export function* completeAuthentication() {
  // Get the full profile for the authenticated user
  const userId = yield select(getAuthenticatedUserId);
  yield put(fetchUserById(userId));
}

/**
 * Change the password (knowing the current one)
 * @param {Object} payload
 * @param {string} payload.email         - Users email address
 * @param {string} payload.new_password1 - New password
 * @param {string} payload.new_password2 - New password confirmation
 */
export function* changePassword({ payload }) {
  const { response } = yield authService.changePassword(payload.email, payload.new_password1);

  if (response) {
    // TODO
  }
}

/**
 * Start the process of resetting a password by sending a reset email
 * @param {string} payload - Email address
 */
export function* resetPassword({ payload }) {
  const { error } = yield authService.changePassword(payload);

  if (!error) {
    yield put(ui.updatePasswordResetStatus("emailed"));
  }
}

export function* logout() {
  yield put(createTextNotification("You have successfully logged out!"));
}

export default function* root() {
  yield [
    fork(takeEvery, INIT, checkAuthState),
    fork(takeEvery, actions.AUTHENTICATE_USER, authenticateUser),
    fork(takeEvery, actions.AUTHENTICATION_SUCCESS, completeAuthentication),
    fork(takeEvery, actions.BEGIN_PASSWORD_RESET, resetPassword),
    fork(takeEvery, actions.LOGOUT, logout)
  ];
}
