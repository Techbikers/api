import { combineReducers } from "redux";

import auth from "techbikers/auth/reducers/ui";
import rides from "techbikers/rides/reducers/ui";

export default combineReducers({
  auth,
  rides
});
