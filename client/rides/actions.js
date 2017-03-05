/* global Stripe */

import { EventTypes } from "redux-segment";
import { createAction } from "redux-actions";

import {
  API_REQUEST,
  rideRegistrationSchema
} from "../middleware/api";

export const FETCH_ALL_RIDES = "FETCH_ALL_RIDES";
export const fetchAllRides = createAction(FETCH_ALL_RIDES);

export const FETCH_RIDE_BY_ID = "FETCH_RIDE_BY_ID";
export const fetchRideById = createAction(FETCH_RIDE_BY_ID);

export const FETCH_RIDES_BY_USER = "FETCH_RIDES_BY_USER";
export const fetchRidesByUser = createAction(FETCH_RIDES_BY_USER);

export const FETCH_RIDE_REGISTRATION_DETAILS = "FETCH_RIDE_REGISTRATION_DETAILS";
export const fetchRideRegistrationDetails = createAction(
  FETCH_RIDE_REGISTRATION_DETAILS,
  (rideId, userId) => ({ rideId, userId })
);

export const NEW_RIDE_REGISTRATION_REQUEST = "NEW_RIDE_REGISTRATION_REQUEST";
export const NEW_RIDE_REGISTRATION_RESPONSE = "NEW_RIDE_REGISTRATION_RESPONSE";
export const NEW_RIDE_REGISTRATION_ERROR = "NEW_RIDE_REGISTRATION_ERROR";

export function registerUserForRide(rideId, payload = null) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ride: rideId,
      payload
    })
  };

  return {
    [API_REQUEST]: {
      endpoint: `/rides/${rideId}/riders`,
      fetchOptions,
      schema: rideRegistrationSchema,
      requestActionType: NEW_RIDE_REGISTRATION_REQUEST,
      successActionType: NEW_RIDE_REGISTRATION_RESPONSE,
      errorActionType: NEW_RIDE_REGISTRATION_ERROR
    },
    meta: {
      analytics: {
        eventType: EventTypes.track,
        eventPayload: {
          properties: { ride: rideId }
        }
      }
    }
  };
}

export const RIDE_REGISTRATION_CHARGE_REQUEST = "RIDE_REGISTRATION_CHARGE_REQUEST";
export const RIDE_REGISTRATION_CHARGE_RESPONSE = "RIDE_REGISTRATION_CHARGE_RESPONSE";
export const RIDE_REGISTRATION_CHARGE_ERROR = "RIDE_REGISTRATION_CHARGE_ERROR";

export function chargeUserForRide(rideId, userId, token = null, amount = null) {
  const fetchOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ride: rideId,
      token,
      amount
    })
  };

  return {
    [API_REQUEST]: {
      endpoint: `/rides/${rideId}/riders/${userId}/charge`,
      fetchOptions,
      schema: rideRegistrationSchema,
      requestActionType: RIDE_REGISTRATION_CHARGE_REQUEST,
      successActionType: RIDE_REGISTRATION_CHARGE_RESPONSE,
      errorActionType: RIDE_REGISTRATION_CHARGE_ERROR
    },
    meta: {
      analytics: {
        eventType: EventTypes.track,
        eventPayload: {
          properties: { ride: rideId, amount }
        }
      }
    }
  };
}

export const CREATE_STRIPE_TOKEN_REQUEST = "CREATE_STRIPE_TOKEN_REQUEST";
export const CREATE_STRIPE_TOKEN_RESPONSE = "CREATE_STRIPE_TOKEN_RESPONSE";
export const CREATE_STRIPE_TOKEN_ERROR = "CREATE_STRIPE_TOKEN_ERROR";

export function createTokenAndChargeUserForRide(rideId, userId, amount, cardDetails, publicKey) {
  function actionWith(data) {
    return {
      ...data,
      meta: {
        analytics: {
          eventType: EventTypes.track,
          eventPayload: {
            properties: { ride: rideId, amount }
          }
        }
      }
    };
  }

  return dispatch => {
    dispatch(actionWith({ type: CREATE_STRIPE_TOKEN_REQUEST }));
    Stripe.setPublishableKey(publicKey);
    Stripe.card.createToken(cardDetails, (status, response) => {
      if (!response.error) {
        dispatch(actionWith({ type: CREATE_STRIPE_TOKEN_RESPONSE, response }));
        dispatch(chargeUserForRide(rideId, userId, response.id, amount));
      } else {
        dispatch(actionWith({ type: CREATE_STRIPE_TOKEN_ERROR, error: response.error }));
      }
    });
  };
}

export const OPEN_RIDE_REGISTRATION_MODAL = "OPEN_RIDE_REGISTRATION_MODAL";

export function openRideRegistrationModal() {
  return { type: OPEN_RIDE_REGISTRATION_MODAL };
}

export const CLOSE_RIDE_REGISTRATION_MODAL = "CLOSE_RIDE_REGISTRATION_MODAL";

export function closeRideRegistrationModal() {
  return { type: CLOSE_RIDE_REGISTRATION_MODAL };
}
