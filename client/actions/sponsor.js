import { arrayOf } from "normalizr";
import { API_REQUEST, sponsorSchema } from "../middleware/api";

export const GET_SPONSOR_REQUEST = "GET_SPONSOR_REQUEST";
export const GET_SPONSOR_RESPONSE = "GET_SPONSOR_RESPONSE";
export const GET_SPONSOR_ERROR = "GET_SPONSOR_ERROR";

export function getSponsors() {
  return {
    [API_REQUEST]: {
      endpoint: "/sponsors/",
      schema: arrayOf(sponsorSchema),
      requestActionType: GET_SPONSOR_REQUEST,
      successActionType: GET_SPONSOR_RESPONSE,
      errorActionType: GET_SPONSOR_ERROR
    }
  }
}

export function getSponsorById(id) {
  return {
    [API_REQUEST]: {
      endpoint: `/sponsors/${id}`,
      schema: sponsorSchema,
      requestActionType: GET_SPONSOR_REQUEST,
      successActionType: GET_SPONSOR_RESPONSE,
      errorActionType: GET_SPONSOR_ERROR
    }
  }
}

export function getSponsorsForRide(rideId) {
  return {
    [API_REQUEST]: {
      endpoint: `/rides/${rideId}/sponsors`,
      schema: arrayOf(sponsorSchema),
      requestActionType: GET_SPONSOR_REQUEST,
      successActionType: GET_SPONSOR_RESPONSE,
      errorActionType: GET_SPONSOR_ERROR
    }
  }
}