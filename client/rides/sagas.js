import { takeEvery, call, fork, put } from "redux-saga/effects";
import { Schema, arrayOf } from "normalizr";

import { callApi } from "techbikers/utils/api";
import { stripeCreateToken } from "techbikers/utils/payment";
import * as actions from "techbikers/rides/actions";
import { ChapterSchema } from "techbikers/chapters/sagas";
import { UserSchema } from "techbikers/users/sagas";
import { addError } from "techbikers/errors/actions";

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
export function* fetchRideRegistrationDetails({ payload: { rideId, userId } }) {
  return yield call(callApi, `/rides/${rideId}/riders/${userId}`, {}, RegistrationSchema);
}

/**
 * Register the authenticated user for a new ride
 * @param {Object} payload
 * @param {number} payload.rideId  - Ride ID
 * @param {Object} payload.payload - Registration payload (statement, ability etc)
 */
export function* rideRegistration({ payload: { rideId, payload } }) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ride: rideId,
      payload
    })
  };
  return yield call(callApi, `/rides/${rideId}/riders`, fetchOptions, RegistrationSchema);
}

/**
 * Charge the user for the ride
 * @param {Object} payload
 * @param {number} payload.rideId      - Ride ID for the ride the user is paying for
 * @param {number} payload.userId      - User ID
 * @param {number} payload.amount      - The amount the user is paying
 * @param {Object} payload.cardDetails - Card details object from payment form
 * @param {string} payload.publicKey   - The Stripe public key used for this payment
 */
export function* rideRegistrationPayment({ payload: { rideId, userId, amount, cardDetails, publicKey } }) {
  // First we need to get a token from Stripe to make the payment with
  const { response } = yield call(stripeCreateToken, publicKey, cardDetails);

  if (response.error) {
    // Something went wrong when getting the charge token
    const { type, message } = response.error;
    yield [
      put(actions.registrationFailure()),
      put(addError("payment", type, message))
    ];
    return false;
  }

  // Now we can go ahead and charge the user
  const fetchOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ride: rideId,
      token: response.id,
      amount
    })
  };
  const result = yield call(callApi, `/rides/${rideId}/riders/${userId}/charge`, fetchOptions, RegistrationSchema);

  if (!result.error) {
    // Payment successful - the user is now registered!
    yield put(actions.registrationSuccess());
    return true;
  } else {
    // Something went wrong
    yield put(actions.registrationFailure());
    return false; // TODO
  }
}

export default function* root() {
  yield [
    fork(takeEvery, actions.FETCH_ALL_RIDES, fetchAllRides),
    fork(takeEvery, actions.FETCH_RIDE_BY_ID, fetchRideById),
    fork(takeEvery, actions.FETCH_RIDES_BY_USER, fetchRidesByUser),
    fork(takeEvery, actions.FETCH_RIDE_REGISTRATION_DETAILS, fetchRideRegistrationDetails),
    fork(takeEvery, actions.REGISTER_USER_FOR_RIDE, rideRegistration),
    fork(takeEvery, actions.CHARGE_USER_FOR_RIDE, rideRegistrationPayment)
  ];
}
