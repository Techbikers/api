import { merge } from "lodash";
import { combineReducers } from "redux";

import {
  UPDATE_META_INFO } from "techbikers/app/actions";

export default combineReducers({
  meta
});

export function meta(state = {}, { type, props }) {
  if (type === UPDATE_META_INFO) {
    return merge({}, state, props);
  } else {
    return state;
  }
}
