import { createAction } from "redux-actions";

export const FETCH_ALL_SPONSORS = "FETCH_ALL_SPONSORS";
export const fetchAllSponsors = createAction(FETCH_ALL_SPONSORS);

export const FETCH_SPONSOR_BY_ID = "FETCH_SPONSOR_BY_ID";
export const fetchSponsorById = createAction(FETCH_SPONSOR_BY_ID);

export const FETCH_SPONSORS_BY_RIDE = "FETCH_SPONSORS_BY_RIDE";
export const fetchSponsorsByRide = createAction(FETCH_SPONSORS_BY_RIDE);
