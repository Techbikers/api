import { combineReducers } from "redux";

import * as ui from "techbikers/auth/actions/ui";

export default combineReducers({
  passwordResetStatus
});

function passwordResetStatus(state = null, { type, payload }) {
  switch (type) {
    case ui.UPDATE_PASSWORD_RESET_STATUS:
      return payload;
    case ui.CLEAR_PASSWORD_RESET_STATUS:
      return null;
    default:
      return state;
  }
}
