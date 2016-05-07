import Raven from "raven-js";

import { AUTHENTICATION_SUCCESS, LOGOUT } from "../actions/authentication";
import { INIT } from "../actions/init";
import { SENTRY_DSN } from "../config";

Raven.config(SENTRY_DSN).install();

export default store => next => action => {
  const oldState = store.getState();
  const context = { extra: { state: oldState, action } };

  // don't use Raven.wrap() as it will permanently modify next()
  const result = Raven.context(context, () => next(action));
  const newState = store.getState();

  switch (action.type) {
    case INIT:
      if (newState.authentication.state === 'authenticated') {
        handleAuthentication(newState);
      }
      break

    case AUTHENTICATION_SUCCESS:
      handleAuthentication(newState);
      break

    case LOGOUT:
      handleLogout();
      break

    default:
      if (action.error) {
        Raven.captureMessage(action.error.message || action.error, { details: action.error, level: "info" });
        break;
      }
  }

  return result;
}

function handleAuthentication(newState) {
  const { userId, organisationId } = newState.authentication.claims;
  const email = newState.authentication.email;
  Raven.setUserContext({ userId, organisationId, email });
}

function handleLogout() {
  Raven.setUserContext();
}
