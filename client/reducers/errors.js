import { CLEAR_ERRORS } from "../actions/error";

export default function errors(state = {}, { type, error}) {
  switch (type) {
    case CLEAR_ERRORS:
      return {};
    default:
      if (error) {
        return {
          ...state,
          ...error
        }
      }

      return state;
  }
}
