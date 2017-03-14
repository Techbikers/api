import jwtDecode from "jwt-decode";
import { handleActions } from "redux-actions";

import * as actions from "techbikers/auth/actions";

export default handleActions({
  [actions.authenticateUser]: state => ({
    ...state,
    state: "authenticating"
  }),

  [actions.authSuccess]: (state, { payload }) => {
    const { idToken, accessToken } = payload;
    const claims = jwtDecode(idToken);

    return {
      ...state,
      state: "authenticated",
      idToken,
      accessToken,
      claims
    };
  },

  [actions.authFailure]: state => ({
    ...state,
    state: "unauthenticated"
  }),

  [actions.logout]: () => ({
    state: "unauthenticated",
    claims: {}
  })
}, {
  state: "unauthenticated",
  claims: {}
});
