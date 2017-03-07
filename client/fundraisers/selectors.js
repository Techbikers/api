import { createSelector } from "reselect";

import { getCurrentRide } from "techbikers/rides/selectors";
import { getAuthenticatedUserId } from "techbikers/auth/selectors";

const fundraiserSelector = state => state.entities.fundraiser || {};

export const getAllFundraisers = createSelector(
  [fundraiserSelector],
  fundraisers => Object.values(fundraisers)
);

export const getActiveFundraisers = createSelector(
  [getAllFundraisers],
  fundraisers => fundraisers.filter(fundraiser => fundraiser.pageStatus)
);

export const getLeaderboard = createSelector(
  [getActiveFundraisers],
  fundraisers => fundraisers.sort((a, b) => {
    const [aTotal, bTotal] = [parseFloat(a.totalRaised), parseFloat(b.totalRaised)];
    if (aTotal > bTotal) {
      return -1;
    } else if (aTotal < bTotal) {
      return 1;
    } else {
      return 0;
    }
  })
);

export const getFundraiserForCurrentRideAndUser = createSelector(
  [getAllFundraisers, getCurrentRide, getAuthenticatedUserId],
  (fundraisers, ride, userId) => fundraisers.find(fundraiser => fundraiser.ride === ride.id && fundraiser.user === userId)
);
