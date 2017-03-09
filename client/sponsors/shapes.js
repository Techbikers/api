import { PropTypes } from "react";

export const RideSponsor = PropTypes.shape({
  ride: PropTypes.number.isRequired,
  sponsorLevel: PropTypes.string.isRequired
});

export const SponsorShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  organisation: PropTypes.string.isRequired,
  description: PropTypes.string,
  logo: PropTypes.string.isRequired,
  website: PropTypes.string,
  twitter: PropTypes.string,
  facebook: PropTypes.string,
  rides: PropTypes.arrayOf(RideSponsor)
});
