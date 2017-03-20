import { handleActions } from "redux-actions";

import * as ui from "techbikers/rides/actions/ui";

const defaultState = {
  rideRegistrationModal: false
};

export default handleActions({
  [ui.openRideRegistrationModal]: state => ({
    ...state,
    rideRegistrationModal: true
  }),

  [ui.closeRideRegistrationModal]: state => ({
    ...state,
    rideRegistrationModal: false
  })
}, defaultState);
