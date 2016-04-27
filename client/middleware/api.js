import { normalize, Schema, arrayOf } from "normalizr";
import fetch from "isomorphic-fetch";
import { UNAUTHORIZED } from "http-status";
import Cookie from "js-cookie";
import { API_ROOT } from "../config";

export const API_REQUEST = Symbol("API_REQUEST");
export const UNEXPECTED_UNAUTHORIZED_API_RESPONSE = "UNEXPECTED_UNAUTHORIZED_API_RESPONSE";

export const rideSchema = new Schema("ride");
export const userSchema = new Schema("user");
export const chapterSchema = new Schema("chapter");
export const sponsorSchema = new Schema("sponsor");
export const fundraiserSchema = new Schema("fundraiser");
export const rideRegistrationSchema = new Schema("rideRegistration");

userSchema.define({
  fundraisers: arrayOf(fundraiserSchema)
});

rideSchema.define({
  chapter: chapterSchema,
  riders: arrayOf(userSchema)
});

export default store => next => action => {
  const requestData = action[API_REQUEST]
  const { authentication } = store.getState()

  if (typeof requestData === "undefined") {
    return next(action)
  }

  const {
    endpoint,
    fetchOptions = {},
    schema,
    requestActionType,
    successActionType,
    errorActionType
  } = requestData

  if (typeof endpoint !== "string") {
    throw new Error("Specify a string endpoint URL.")
  }

  let tollerateUnauthorized = true
  if (authentication && authentication.token) {
    tollerateUnauthorized = false
    fetchOptions.headers = {
      Authorization: `Bearer ${authentication.token}`,
      ...fetchOptions.headers
    }
  }

  function actionWith(data) {
    const nextAction = { ...action, ...data }
    Reflect.deleteProperty(nextAction, API_REQUEST)
    return nextAction
  }

  next(actionWith({ type: requestActionType }))

  return callApi(endpoint, fetchOptions, schema).then(
    response => next(actionWith({
      type: successActionType,
      response
    })),
    error => {
      const isNetworkError = error instanceof Error
      const httpStatus = error.httpStatus

      if (!tollerateUnauthorized && httpStatus === UNAUTHORIZED) {
        next({ type: UNEXPECTED_UNAUTHORIZED_API_RESPONSE })
      }

      return next(actionWith({
        type: errorActionType,
        error: error.non_field_errors || "Something bad happened",
        isNetworkError,
        httpStatus
      }))
    }
  )
}

function callApi(endpoint, fetchOptions, schema) {
  return fetch(API_ROOT + endpoint, fetchOptions)
    .then(response =>
      response.json().then(json => ({ json, response }))
    )
    .then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject({ ...json, httpStatus: response.status })
      } else {
        return schema ? normalize(json, schema) : json
      }
    })
}
