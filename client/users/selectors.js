import { isEmpty } from "lodash";
import { createSelector } from "reselect";

import { getCurrentEntity } from "techbikers/app/selectors";
import { getCurrentRide } from "techbikers/rides/selectors";

const userSelector = state => state.entities.user || {};
const rideSelector = state => state.entities.ride || {};

export const getCurrentUser = createSelector(
  [userSelector, getCurrentEntity],
  (users, entity) => users[entity.id]
);

export const getUsersOnCurrentRide = createSelector(
  [userSelector, getCurrentRide],
  (users, ride) => (ride ? ride.riders.reduce((riders, id) => {
    if (!users[id]) {
      return [...riders];
    } else {
      return [...riders, users[id]];
    }
  }, []) : [])
);

export const getRidesForCurrentUser = createSelector(
  [rideSelector, getCurrentUser],
  (rides, user) => (user && !isEmpty(rides) ? user.rides.map(id => rides[id]) : [])
);
