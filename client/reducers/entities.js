import { merge } from "lodash";

export default function entities(state = {}, action) {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities);
  } else {
    return state;
  }
}
