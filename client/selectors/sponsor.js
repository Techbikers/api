import { createSelector } from "reselect";

const sponsorSelector = (state) => state.entities.sponsor || {}

export const getActiveSponsors = createSelector(
  [sponsorSelector],
  (sponsors) => Object.keys(sponsors).map(id => sponsors[id])
)