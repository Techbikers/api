import { createSelector } from "reselect";

import { getCurrentRide } from "./ride";

const locationSelector = state => state.routing.locationBeforeTransitions || {};

export const getCurrentPathname = createSelector(
  [locationSelector],
  (location) => location.pathname
)