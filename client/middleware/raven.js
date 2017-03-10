import Raven from "raven-js";

import { AUTHENTICATION_SUCCESS, LOGOUT } from "techbikers/auth/actions";
import { INIT } from "techbikers/app/actions";
import { SENTRY_DSN } from "techbikers/config";

Raven.config(SENTRY_DSN).install();

export default store => next => action => {
  const oldState = store.getState();
  const context = { extra: { state: oldState, action } };

  // don't use Raven.wrap() as it will permanently modify next()
  const result = Raven.context(context, () => next(action));
  const newState = store.getState();

  switch (action.type) {
    case INIT:
      if (newState.auth.state === "authenticated") {
        handleAuthentication(newState);
      }
      break;

    case AUTHENTICATION_SUCCESS:
      handleAuthentication(newState);
      break;

    case LOGOUT:
      Raven.setUserContext();
      break;

    default:
      if (action.error) {
        Raven.captureMessage(action.payload.message || action.payload, { details: action.payload, level: "info" });
        break;
      }
  }

  return result;
};

function handleAuthentication(state) {
  const { user } = state.auth;
  Raven.setUserContext({ user });
}
