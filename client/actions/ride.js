import { arrayOf } from "normalizr";
import { EventTypes } from "redux-segment";

import {
  API_REQUEST,
  rideSchema,
  rideRegistrationSchema
} from "../middleware/api";

export const GET_RIDE_REQUEST = "GET_RIDE_REQUEST";
export const GET_RIDE_RESPONSE = "GET_RIDE_RESPONSE";
export const GET_RIDE_ERROR = "GET_RIDE_ERROR";

export function getRides() {
  return {
    [API_REQUEST]: {
      endpoint: "/rides/",
      schema: arrayOf(rideSchema),
      requestActionType: GET_RIDE_REQUEST,
      successActionType: GET_RIDE_RESPONSE,
      errorActionType: GET_RIDE_ERROR
    }
  }
}

export function getRideById(rideId) {
  return {
    [API_REQUEST]: {
      endpoint: `/rides/${rideId}`,
      schema: rideSchema,
      requestActionType: GET_RIDE_REQUEST,
      successActionType: GET_RIDE_RESPONSE,
      errorActionType: GET_RIDE_ERROR
    }
  }
}

export function getRidesByUser(userId) {
  return {
    [API_REQUEST]: {
      endpoint: `/riders/${userId}/rides`,
      schema: arrayOf(rideSchema),
      requestActionType: GET_RIDE_REQUEST,
      successActionType: GET_RIDE_RESPONSE,
      errorActionType: GET_RIDE_ERROR
    }
  }
}

export const GET_RIDE_REGISTRATION_REQUEST = "GET_RIDE_REGISTRATION_REQUEST";
export const GET_RIDE_REGISTRATION_RESPONSE = "GET_RIDE_REGISTRATION_RESPONSE";
export const GET_RIDE_REGISTRATION_ERROR = "GET_RIDE_REGISTRATION_ERROR";

export function getRideRegistrationDetails(rideId, userId) {
  return {
    [API_REQUEST]: {
      endpoint: `/rides/${rideId}/riders/${userId}`,
      schema: rideRegistrationSchema,
      requestActionType: GET_RIDE_REGISTRATION_REQUEST,
      successActionType: GET_RIDE_REGISTRATION_RESPONSE,
      errorActionType: GET_RIDE_REGISTRATION_ERROR
    }
  }
}

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
  }
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
  }
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
  };

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
  }
}

export const OPEN_RIDE_REGISTRATION_MODAL = "OPEN_RIDE_REGISTRATION_MODAL";

export function openRideRegistrationModal() {
  return { type: OPEN_RIDE_REGISTRATION_MODAL }
}

export const CLOSE_RIDE_REGISTRATION_MODAL = "CLOSE_RIDE_REGISTRATION_MODAL";

export function closeRideRegistrationModal() {
  return { type: CLOSE_RIDE_REGISTRATION_MODAL }
}