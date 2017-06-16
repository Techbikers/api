import moment from "moment";
import { createSelector } from "reselect";

import { getCurrentEntity } from "techbikers/app/selectors";
import { getAuthenticatedUserId } from "techbikers/auth/selectors";

export const getRides = state => state.entities.ride || {};
export const getRegistrations = state => state.entities.registration || {};

export const getAllRides = createSelector(
  [getRides],
  rides => Object.values(rides).sort((a, b) =>
    moment(a.startDate).isAfter(b.startDate)
  )
);

export const getCurrentRide = createSelector(
  [getRides, getCurrentEntity],
  (rides, entity) => rides[entity.id]
);

export const getUpcomingRides = createSelector(
  [getAllRides],
  rides => rides.filter(ride => moment().isSameOrBefore(ride.endDate))
);

export const getPastRides = createSelector(
  [getAllRides],
  rides => rides.filter(ride => moment().isAfter(ride.endDate))
);

export const getRegistrationsForAllRides = createSelector(
  [getRegistrations],
  registrations => Object.values(registrations)
);

export const getRegistrationsForCurrentRide = createSelector(
  [getRegistrationsForAllRides, getCurrentEntity],
  (registrations, entity) => registrations.filter(registration => registration.ride === entity.id)
);

export const getRegistrationForCurrentRideAndUser = createSelector(
  [getRegistrationsForCurrentRide, getAuthenticatedUserId],
  (registrations, userId) => registrations.find(registration => registration.user === userId)
);
