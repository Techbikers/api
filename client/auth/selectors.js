import { createSelector } from "reselect";

export const getUserEntities = state => state.entities.user || {};
export const getAuthState = state => state.auth || {};

export const getAuthenticatedUserId = createSelector(
  getAuthState,
  auth => (auth.state === "authenticated" && auth.claims["https://techbikers.com/user_id"])
);

export const getAuthToken = createSelector(
  getAuthState,
  auth => auth.idToken
);

export const getAuthenticatedUser = createSelector(
  [getUserEntities, getAuthenticatedUserId],
  (users, id) => users[id]
);

export const getAuthCallback = createSelector(
  getAuthState,
  auth => auth.callback || {}
);
