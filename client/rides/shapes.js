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
  price: PropTypes.string,
  fullCost: PropTypes.string,
  currency: PropTypes.string,
  isOver: PropTypes.bool.isRequired,
  fundraisingTotal: PropTypes.string,
  fundraisingTarget: PropTypes.string
});

export const RegistrationShape = PropTypes.shape({

})
