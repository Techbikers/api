import { EventTypes } from "redux-segment";
import { createAction } from "redux-actions";
import { identity } from "lodash";

export const AUTHENTICATE_USER = "AUTHENTICATE_USER";
export const authenticateUser = createAction(AUTHENTICATE_USER,
  (email, password) => ({ email, password })
);

export const AUTHENTICATION_SUCCESS = "AUTHENTICATION_SUCCESS";
export const authSuccess = createAction(AUTHENTICATION_SUCCESS);

export const AUTHENTICATION_COMPLETE = "AUTHENTICATION_COMPLETE";
export const authComplete = createAction(AUTHENTICATION_COMPLETE,
  identity,
  ({ userId, email, firstName, lastName }) => ({
    analytics: [
      {
        eventType: EventTypes.alias,
        eventPayload: {
          userId
        }
      },
      {
        eventType: EventTypes.identify,
        eventPayload: {
          userId,
          traits: { firstName, lastName, email }
        }
      }
    ]
  })
);

export const AUTHENTICATION_FAILURE = "AUTHENTICATION_FAILURE";
export const authFailure = createAction(AUTHENTICATION_FAILURE);

export const AUTHENTICATION_CALLBACK = "AUTHENTICATION_CALLBACK";
export const authCallback = createAction(AUTHENTICATION_CALLBACK);

export const REFRESH_TOKEN = "REFRESH_TOKEN";
export const refreshToken = createAction(REFRESH_TOKEN);

export const EXCHANGE_TOKEN = "EXCHANGE_TOKEN";
export const exchangeToken = createAction(EXCHANGE_TOKEN,
  (backend, code, state) => ({ backend, code, state })
);

export const CHANGE_PASSWORD = "CHANGE_PASSWORD";
export const changePassword = createAction(CHANGE_PASSWORD,
  (email, password, new_password1, new_password2) => ({ email, password, new_password1, new_password2 }), // eslint-disable-line camelcase
  email => ({
    analytics: {
      eventType: EventTypes.track,
      eventPayload: {
        properties: { email }
      }
    }
  })
);

export const BEGIN_PASSWORD_RESET = "BEGIN_PASSWORD_RESET";
export const beginPasswordReset = createAction(BEGIN_PASSWORD_RESET,
  identity,
  email => ({
    analytics: {
      eventType: EventTypes.track,
      eventPayload: {
        properties: { email }
      }
    }
  })
);

export const LOGOUT = "LOGOUT";
export const logout = createAction(LOGOUT,
  identity,
  () => ({ analytics: EventTypes.reset })
);
