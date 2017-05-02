import { takeEvery, call, fork } from "redux-saga/effects";
import { schema } from "normalizr";

import { callApi } from "techbikers/utils/api";
import * as actions from "techbikers/sponsors/actions";

export const RideSponsorSchema = new schema.Entity("rideSponsor", {}, {
  idAttribute: value => `${value.ride}-${value.sponsor}`
});

export const SponsorSchema = new schema.Entity("sponsor", {
  rides: [RideSponsorSchema]
});

/**
 * Fetch all sponsors
 */
export function* fetchAllSponsors() {
  return yield call(callApi, "/sponsors/", {}, [SponsorSchema]);
}

/**
 * Fetch a sponsor by it's ID
 * @param {number} payload - ID of the sponsor
 */
export function* fetchSponsorById({ payload }) {
  return yield call(callApi, `/sponsors/${payload}`, {}, SponsorSchema);
}

/**
 * Fetch all sponsors for a particular rides
 * @param {number} payload - ID of the ride
 */
export function* fetchSponsorsByRide({ payload }) {
  return yield call(callApi, `/sponsors/?rides=${payload}`, {}, [SponsorSchema]);
}

export default function* root() {
  yield [
    fork(takeEvery, actions.FETCH_ALL_SPONSORS, fetchAllSponsors),
    fork(takeEvery, actions.FETCH_SPONSOR_BY_ID, fetchSponsorById),
    fork(takeEvery, actions.FETCH_SPONSORS_BY_RIDE, fetchSponsorsByRide)
  ];
}
