import { createSelector } from "reselect";

export const getCurrentEntity = state => state.app.entity || {};
export const getLocation = state => state.routing.locationBeforeTransitions || {};

export const getCurrentPathname = createSelector(
  [getLocation],
  location => location.pathname
);
