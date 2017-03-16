import { handleActions } from "redux-actions";

import * as actions from "techbikers/app/actions";

const defaultState = {
  entity: {}
};

export default handleActions({
  [actions.updateCurrentEntity]: (state, { payload }) => ({
    ...state,
    entity: { ...payload }
  })
}, defaultState);
