import { arrayOf } from "normalizr";
import { EventTypes } from "redux-segment";

import { API_REQUEST, fundraiserSchema } from "../middleware/api";

export const GET_FUNDRAISER_REQUEST = "GET_FUNDRAISER_REQUEST";
export const GET_FUNDRAISER_RESPONSE = "GET_FUNDRAISER_RESPONSE";
export const GET_FUNDRAISER_ERROR = "GET_FUNDRAISER_ERROR";

export function getActiveFundraisers() {
  return {
    [API_REQUEST]: {
      endpoint: "/fundraisers/",
      schema: arrayOf(fundraiserSchema),
      requestActionType: GET_FUNDRAISER_REQUEST,
      successActionType: GET_FUNDRAISER_RESPONSE,
      errorActionType: GET_FUNDRAISER_ERROR
    }
  }
}

export const NEW_FUNDRAISER_REQUEST = "NEW_FUNDRAISER_REQUEST";
export const NEW_FUNDRAISER_RESPONSE = "NEW_FUNDRAISER_RESPONSE";
export const NEW_FUNDRAISER_ERROR = "NEW_FUNDRAISER_ERROR";

export function createFundraisingPage(rideId, userId) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ride: rideId,
      user: userId
    })
  };

  return {
    [API_REQUEST]: {
      endpoint: `/rides/${rideId}/riders/${userId}/fundraiser`,
      fetchOptions,
      schema: fundraiserSchema,
      requestActionType: NEW_FUNDRAISER_REQUEST,
      successActionType: NEW_FUNDRAISER_RESPONSE,
      errorActionType: NEW_FUNDRAISER_ERROR
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
