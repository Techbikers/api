import { PropTypes } from "react";

export const UserShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  avatar: PropTypes.string,
  company: PropTypes.string,
  website: PropTypes.string,
  twitter: PropTypes.string,
  biography: PropTypes.string,
  statement: PropTypes.string,
  donationPage: PropTypes.string,
  isMember: PropTypes.bool,
  rides: PropTypes.arrayOf(PropTypes.number),
  fundraisers: PropTypes.arrayOf(PropTypes.number)
});
