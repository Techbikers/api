import { isEmpty } from "lodash";
import { createSelector } from "reselect";

import { getCurrentRide, getRegistrationsForCurrentRide } from "techbikers/rides/selectors";

const userSelector = state => state.entities.user || {};
const rideSelector = state => state.entities.ride || {};
const authenticationSelector = state => state.authentication || {};
const pageEntityIdSelector = state => state.page.entity.id || null;

export const getAuthenticatedUserId = createSelector(
  authenticationSelector,
  authentication => authentication.state === "authenticated" ? authentication.claims.userId : null
)

export const getAuthenticationToken = createSelector(
  authenticationSelector,
  authentication => authentication.token
)

export const getAuthenticatedUser = createSelector(
  [userSelector, getAuthenticatedUserId],
  (users, userId) => users[userId]
)

export const getCurrentUser = createSelector(
  [userSelector, pageEntityIdSelector],
  (users, id) => users[id]
)

export const getUsersOnCurrentRide = createSelector(
  [userSelector, getCurrentRide],
  (users, ride) => ride ? ride.riders.map(id => users[id]) : []
)

export const getRidesForCurrentUser = createSelector(
  [rideSelector, getCurrentUser],
  (rides, user) => user && !isEmpty(rides) ? user.rides.map(id => rides[id]) : []
)

export const getRegistrationForCurrentRideAndUser = createSelector(
  [getRegistrationsForCurrentRide, getAuthenticatedUserId],
  (registrations, userId) => registrations.find(registration => registration.user === userId)
)
