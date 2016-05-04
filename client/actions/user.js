import { arrayOf } from "normalizr";
import { EventTypes } from "redux-segment";

import { API_REQUEST, userSchema } from "../middleware/api";
import { authenticateAs } from "./authentication";

export const GET_USER_REQUEST = "GET_USER_REQUEST";
export const GET_USER_RESPONSE = "GET_USER_RESPONSE";
export const GET_USER_ERROR = "GET_USER_ERROR";

export function getUserById(id) {
  return {
    [API_REQUEST]: {
      endpoint: `/riders/${id}`,
      schema: userSchema,
      requestActionType: GET_USER_REQUEST,
      successActionType: GET_USER_RESPONSE,
      errorActionType: GET_USER_ERROR
    }
  }
}

export function getUsersForRide(rideId) {
  return {
    [API_REQUEST]: {
      endpoint: `/rides/${rideId}/riders`,
      schema: arrayOf(userSchema),
      requestActionType: GET_USER_REQUEST,
      successActionType: GET_USER_RESPONSE,
      errorActionType: GET_USER_ERROR
    }
  }
}

export const CREATE_USER_REQUEST = "CREATE_USER_REQUEST";
export const CREATE_USER_RESPONSE = "CREATE_USER_RESPONSE";
export const CREATE_USER_ERROR = "CREATE_USER_ERROR";

export function createUser(user) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  }

  return {
    [API_REQUEST]: {
      endpoint: "/riders/",
      schema: userSchema,
      fetchOptions,
      requestActionType: CREATE_USER_REQUEST,
      successActionType: CREATE_USER_RESPONSE,
      errorActionType: CREATE_USER_ERROR
    },
    meta: {
      analytics: {
        eventType: EventTypes.track
      }
    }
  }
}

export function createUserAndAuthenticate(user) {
  return dispatch => dispatch(createUser(user)).then(
    response => dispatch(authenticateAs(user.email, user.password))
  );
}

export const UPDATE_USER_REQUEST = "UPDATE_USER_REQUEST";
export const UPDATE_USER_RESPONSE = "UPDATE_USER_RESPONSE";
export const UPDATE_USER_ERROR = "UPDATE_USER_ERROR";

export function updateUser(user) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  }

  return {
    [API_REQUEST]: {
      endpoint: `/riders/${user.id}`,
      schema: userSchema,
      fetchOptions,
      requestActionType: UPDATE_USER_REQUEST,
      successActionType: UPDATE_USER_RESPONSE,
      errorActionType: UPDATE_USER_ERROR
    },
    meta: {
      analytics: {
        eventType: EventTypes.track
      }
    }
  }
}