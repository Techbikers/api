import moment from "moment";
import { createSelector } from "reselect";

import { getCurrentEntity } from "techbikers/app/selectors";

const rideSelector = state => state.entities.ride || {};
const registrationSelector = state => state.entities.rideRegistration || {};

export const getAllRides = createSelector(
  [rideSelector],
  rides => Object.keys(rides).map(id => rides[id])
);

export const getCurrentRide = createSelector(
  [rideSelector, getCurrentEntity],
  (rides, entity) => rides[entity.id]
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
  [getRegistrationsForAllRides, getCurrentEntity],
  (registrations, entity) => registrations.filter(registration => registration.ride === entity.id)
);
