import { PropTypes } from "react";

export const RideShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  strapline: PropTypes.string,
  descriptionHtml: PropTypes.string,
  startLocation: PropTypes.string.isRequired,
  endLocation: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  chapter: PropTypes.number.isRequired,
  riderCapacity: PropTypes.number,
  riders: PropTypes.arrayOf(PropTypes.number),
  spacesLeft: PropTypes.number,
  price: PropTypes.number,
  fullCost: PropTypes.number,
  currency: PropTypes.string,
  isOver: PropTypes.bool.isRequired,
  fundraisingTotal: PropTypes.number,
  fundraisingTarget: PropTypes.number
});

export const RegistrationShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  ride: PropTypes.number.isRequired,
  user: PropTypes.number.isRequired,
  signupDate: PropTypes.string.isRequired,
  signupExpires: PropTypes.string,
  status: PropTypes.string.isRequired,
  paid: PropTypes.bool.isRequired,
  expired: PropTypes.bool.isRequired,
  payload: PropTypes.object
});
