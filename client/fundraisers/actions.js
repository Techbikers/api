import { createAction } from "redux-actions";
import { EventTypes } from "redux-segment";

export const FETCH_ACTIVE_FUNDRAISERS = "FETCH_ACTIVE_FUNDRAISERS";
export const fetchActiveFundraisers = createAction(FETCH_ACTIVE_FUNDRAISERS);

export const CREATE_FUNDRAISER = "CREATE_FUNDRAISER";
export const createFundraiser = createAction(CREATE_FUNDRAISER,
  (rideId, userId) => ({ rideId, userId }),
  ride => ({
    analytics: {
      eventType: EventTypes.track,
      eventPayload: {
        properties: { ride }
      }
    }
  })
);
