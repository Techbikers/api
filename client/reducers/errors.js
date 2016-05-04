import { CLEAR_ERRORS } from "../actions/error";

export default function errors(state = null, { type, error }) {
  switch (type) {
    case CLEAR_ERRORS:
      return null;

    default:
      if (error) {
        return error;
      }

      // Clear the errors every time we dispatch a
      // new action that doesn't contain an error
      return null;
  }
}
