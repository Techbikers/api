import { PropTypes } from "react";

export const ChapterShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  publicKey: PropTypes.string,
  membershipFee: PropTypes.string,
  currency: PropTypes.string
});
