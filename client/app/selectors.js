import { createSelector } from "reselect";

const locationSelector = state => state.routing.locationBeforeTransitions || {};

export const getCurrentPathname = createSelector(
  [locationSelector],
  location => location.pathname
);
