import { EventTypes } from "redux-segment";
import { createAction } from "redux-actions";

export const FETCH_USER_BY_ID = "FETCH_USER_BY_ID";
export const fetchUserById = createAction(FETCH_USER_BY_ID);

export const FETCH_USERS_BY_RIDE = "FETCH_USERS_BY_RIDE";
export const fetchUsersByRide = createAction(FETCH_USERS_BY_RIDE);

export const UPDATE_USER = "UPDATE_USER";
export const updateUser = createAction(UPDATE_USER,
  user => user,
  () => ({ analytics: { eventType: EventTypes.track } })
);
