import { takeEvery, call, fork } from "redux-saga/effects";
import { Schema, arrayOf } from "normalizr";

import { callApi } from "techbikers/utils/api";
import * as actions from "techbikers/rides/actions";
import { ChapterSchema } from "techbikers/chapters/sagas";
import { UserSchema } from "techbikers/users/sagas";

export const RideSchema = new Schema("ride");
export const RegistrationSchema = new Schema("registration");

RideSchema.define({
  chapter: ChapterSchema,
  riders: arrayOf(UserSchema)
});

/**
 * Call the API to fetch all rides
 */
export function* fetchAllRides() {
  return yield call(callApi, "/rides/", {}, arrayOf(RideSchema));
}

/**
 * Call the API to fetch a single ride by its ID
 * @param {number} payload - Ride ID
 */
export function* fetchRideById({ payload }) {
  return yield call(callApi, `/rides/${payload}`, {}, RideSchema);
}

/**
 * Call the API to fetch rides by the user ID
 * @param {number} payload - User ID
 */
export function* fetchRidesByUser({ payload }) {
  return yield call(callApi, `/riders/${payload}/rides`, {}, arrayOf(RideSchema));
}

/**
 * Fetch user registration details for a particular ride
 * @param {Object} payload
 * @param {number} payload.rideId - Ride ID
 * @param {number} payload.userId - User ID
 */
export function* fetchRideRegistrationDetails({ payload }) {
  return yield call(callApi, `/rides/${payload.rideId}/riders/${payload.userId}`, {}, RegistrationSchema);
}

export default function* root() {
  yield [
    fork(takeEvery, actions.FETCH_ALL_RIDES, fetchAllRides),
    fork(takeEvery, actions.FETCH_RIDE_BY_ID, fetchRideById),
    fork(takeEvery, actions.FETCH_RIDES_BY_USER, fetchRidesByUser),
    fork(takeEvery, actions.FETCH_RIDE_REGISTRATION_DETAILS, fetchRideRegistrationDetails)
  ];
}
