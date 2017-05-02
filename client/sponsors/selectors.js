import { createSelector } from "reselect";

import { getCurrentRide } from "techbikers/rides/selectors";

const sponsorEntities = state => state.entities.sponsor || {};
const rideSponsorEntities = state => state.entities.rideSponsor || {};

export const getAllSponsors = createSelector(
  [sponsorEntities],
  sponsors => Object.values(sponsors)
);

export const getSponsorsForCurrentRide = createSelector(
  [getCurrentRide, sponsorEntities, rideSponsorEntities],
  (ride, sponsors, rideSponsors) => {
    if (!ride) {
      return {};
    }

    return Object.values(rideSponsors)
      .filter(item => item.ride === ride.id)
      .reduce(
        (buckets, item) => ({
          ...buckets,
          [item.sponsorLevel]: [
            ...(buckets[item.sponsorLevel] || []),
            sponsors[item.sponsor]
          ]
        }),
        {}
      );
  }
);
