import { handleActions } from "redux-actions";
import { LOCATION_CHANGE } from "react-router-redux";

import {
  addError,
  clearError,
  clearAllErrors
} from "techbikers/errors/actions";

export default handleActions({
  [addError]: (state, { payload }) => ({
    ...state,
    [payload.key]: payload.error
  }),

  [clearError]: (state, { payload }) => ({
    ...state,
    [payload.key]: null
  }),

  [clearAllErrors]: () => ({}),
  [LOCATION_CHANGE]: () => ({})
}, {});
