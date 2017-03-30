import moment from "moment";
import { takeEvery, fork, put, select, call, take, race } from "redux-saga/effects";

import { INIT } from "techbikers/app/actions";
import authService from "techbikers/auth/services";
import {
  createTextNotification,
  createErrorNotification
} from "techbikers/notifications/actions";
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

/**
 * Create a new user and log them in
 * @param {Object} payload - The new user object
 * @param {string} payload.email
 * @param {string} payload.first_name
 * @param {string} payload.last_name
 * @param {string} [payload.company]
 * @param {string} [payload.website]
 * @param {string} payload.password
 * @param {string} payload.password_confirm
 */
export function* createUserAndAuthenticate({ payload }) {
  const { email, password, password_confirm, ...metadata } = payload; // eslint-disable-line camelcase, no-unused-vars

  // Attempt to create the user first
  const { error } = yield authService.signup(
    email,
    password,
    { ...metadata, name: `${metadata.first_name} ${metadata.last_name}` }
  );

  if (!error) {
    // Log the new user in
    yield put(actions.authenticateUser(email, password));

    // Wait for successful authentication then push welcome notification
    const { success } = yield race({
      success: take(actions.AUTHENTICATION_SUCCESS),
      failure: take(actions.AUTHENTICATION_FAILURE)
    });

    if (success) {
      yield put(createTextNotification("Welcome to Techbikers!", 5000));
    } else {
      yield put(createErrorNotification("Ooops, something went wrong"));
    }
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
    fork(takeEvery, actions.SIGNUP, createUserAndAuthenticate),
    fork(takeEvery, actions.LOGOUT, logout)
  ];
}
