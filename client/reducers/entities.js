import { merge } from "lodash";

export default function entities(state = {}, { response, payload }) {
  if (response && response.entities) {
    return merge({}, state, response.entities);
  } else if (payload && payload.entities) {
    return merge({}, state, payload.entities);
  } else {
    return state;
  }
}
