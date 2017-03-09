import { takeEvery, call, fork, put, take } from "redux-saga/effects";
import { Schema, arrayOf } from "normalizr";

import { callApi } from "techbikers/utils/api";
import {
  authenticateUser,
  AUTHENTICATION_SUCCESS } from "techbikers/auth/actions";
import { createTextNotification } from "techbikers/notifications/actions";
import * as actions from "techbikers/users/actions";

export const UserSchema = new Schema("user");

/**
 * Fetch a single user by their ID
 * @param {number} payload - User ID
 */
export function* fetchUserById({ payload }) {
  return yield call(callApi, `/riders/${payload}`, {}, UserSchema);
}

/**
 * Fetch all users by the ride they are riders on
 * @param {number} payload - Ride ID
 */
export function* fetchUsersByRide({ payload }) {
  return yield call(callApi, `/rides/${payload}/riders`, {}, arrayOf(UserSchema));
}

/**
 * Create a new user
 * @param {Object} payload - The new user object
 */
export function* createUser({ payload }) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  };
  return yield call(callApi, "/riders/", fetchOptions, UserSchema);
}

/**
 * Update the user record
 * @param {Object} payload - Updated user object
 */
export function* updateUser({ payload }) {
  const fetchOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  };
  return yield call(callApi, `/riders/${payload.id}`, fetchOptions, UserSchema);
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
  // Attempt to create the user first
  const { error } = yield call(createUser, { payload });

  if (!error) {
    // Log the new user in
    yield put(authenticateUser(payload.email, payload.password));
    // Wait for successful authentication then push welcome notification
    yield take(AUTHENTICATION_SUCCESS);
    yield put(createTextNotification("Welcome to Techbikers!", 5000));
  }
}

export default function* root() {
  yield [
    fork(takeEvery, actions.FETCH_USER_BY_ID, fetchUserById),
    fork(takeEvery, actions.FETCH_USERS_BY_RIDE, fetchUsersByRide),
    fork(takeEvery, actions.CREATE_USER, createUser),
    fork(takeEvery, actions.UPDATE_USER, updateUser),
    fork(takeEvery, actions.CREATE_USER_AND_AUTHENTICATE, createUserAndAuthenticate)
  ];
}
