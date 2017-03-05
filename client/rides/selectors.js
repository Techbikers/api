import moment from "moment";
import { createSelector } from "reselect";

const rideSelector = state => state.entities.ride || {};
const registrationSelector = state => state.entities.rideRegistration || {};
const pageEntityIdSelector = state => Number(state.page.entity.id) || null;

export const getAllRides = createSelector(
  [rideSelector],
  rides => Object.keys(rides).map(id => rides[id])
);

export const getCurrentRide = createSelector(
  [rideSelector, pageEntityIdSelector],
  (rides, id) => rides[id]
);

export const getUpcomingRides = createSelector(
  [getAllRides],
  rides => rides.filter(ride => moment().isSameOrBefore(ride.startDate))
);

export const getPastRides = createSelector(
  [getAllRides],
  rides => rides.filter(ride => moment().isAfter(ride.endDate))
);

export const getRegistrationsForAllRides = createSelector(
  [registrationSelector],
  registrations => Object.keys(registrations).map(id => registrations[id])
);

export const getRegistrationsForCurrentRide = createSelector(
  [getRegistrationsForAllRides, pageEntityIdSelector],
  (registrations, rideId) => registrations.filter(registration => registration.ride === rideId)
);
