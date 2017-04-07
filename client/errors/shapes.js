import { PropTypes } from "react";

export const ErrorShape = PropTypes.shape({
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
});
