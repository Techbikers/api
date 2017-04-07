import { EventTypes } from "redux-segment";
import { createAction } from "redux-actions";

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

export const REGISTER_USER_FOR_RIDE = "REGISTER_USER_FOR_RIDE";
export const registerUserForRide = createAction(REGISTER_USER_FOR_RIDE,
  (rideId, payload) => ({ rideId, payload }),
  rideId => ({
    analytics: {
      eventType: EventTypes.track,
      eventPayload: {
        properties: { ride: rideId }
      }
    }
  })
);

export const CHARGE_USER_FOR_RIDE = "CHARGE_USER_FOR_RIDE";
export const chargeUserForRide = createAction(CHARGE_USER_FOR_RIDE,
  (rideId, userId, amount, cardDetails, publicKey) => ({ rideId, userId, amount, cardDetails, publicKey }),
  (rideId, userId, amount) => ({
    analytics: {
      eventType: EventTypes.track,
      eventPayload: {
        properties: {
          ride: rideId,
          amount
        }
      }
    }
  })
);

export const REGISTRATION_FAILURE = "REGISTRATION_FAILURE";
export const registrationFailure = createAction(REGISTRATION_FAILURE);

export const REGISTRATION_SUCCESS = "REGISTRATION_SUCCESS";
export const registrationSuccess = createAction(REGISTRATION_SUCCESS);
