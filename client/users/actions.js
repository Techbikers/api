import { EventTypes } from "redux-segment";
import { createAction } from "redux-actions";

export const FETCH_USER_BY_ID = "FETCH_USER_BY_ID";
export const fetchUserById = createAction(FETCH_USER_BY_ID);

export const FETCH_USERS_BY_RIDE = "FETCH_USERS_BY_RIDE";
export const fetchUsersByRide = createAction(FETCH_USERS_BY_RIDE);

export const CREATE_USER = "CREATE_USER";
export const createUser = createAction(CREATE_USER,
  user => user,
  ({ email }) => ({
    analytics: {
      eventType: EventTypes.track,
      eventPayload: {
        properties: { email }
      }
    }
  })
);

export const CREATE_USER_AND_AUTHENTICATE = "CREATE_USER_AND_AUTHENTICATE";
export const createUserAndAuthenticate = createAction(CREATE_USER_AND_AUTHENTICATE,
  user => user,
  ({ email }) => ({
    analytics: {
      eventType: EventTypes.track,
      eventPayload: {
        properties: { email }
      }
    }
  })
);

export const UPDATE_USER = "UPDATE_USER";
export const updateUser = createAction(UPDATE_USER,
  user => user,
  () => ({ analytics: { eventType: EventTypes.track } })
);
