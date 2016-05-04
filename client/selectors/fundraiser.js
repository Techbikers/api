import { sortByOrder } from "lodash";
import { createSelector } from "reselect";

const fundraiserSelector = state => state.entities.fundraiser || {};

export const getAllFundraisers = createSelector(
  [fundraiserSelector],
  (fundraisers) => Object.values(fundraisers)
)

export const getActiveFundraisers = createSelector(
  [getAllFundraisers],
  (fundraisers) => fundraisers.filter(fundraiser => fundraiser.pageStatus)
)

export const getLeaderboard = createSelector(
  [getActiveFundraisers],
  (fundraisers) => fundraisers.sort((a, b) => {
    const [aTotal, bTotal] = [parseFloat(a.totalRaised), parseFloat(b.totalRaised)];
    if (aTotal > bTotal) {
      return -1;
    } else if (aTotal < bTotal) {
      return 1;
    } else {
      return 0;
    }
  })
)