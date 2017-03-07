import { createSelector } from "reselect";

const userSelector = state => state.entities.user || {};
const authSelector = state => state.auth || {};

export const getAuthenticatedUserId = createSelector(
  authSelector,
  auth => (auth.state === "authenticated" ? auth.claims.userId : null)
);

export const getAuthToken = createSelector(
  authSelector,
  auth => auth.token
);

export const getAuthenticatedUser = createSelector(
  [userSelector, getAuthenticatedUserId],
  (users, id) => users[id]
);
