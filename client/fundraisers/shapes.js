import { PropTypes } from "react";

export const FundraiserShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  user: PropTypes.number,
  ride: PropTypes.number,
  pageId: PropTypes.number,
  pageUrl: PropTypes.string,
  signOnUrl: PropTypes.string,
  pageStatus: PropTypes.bool,
  currency: PropTypes.string,
  fundraisingTarget: PropTypes.number,
  totalRaisedOffline: PropTypes.number,
  totalRaisedOnline: PropTypes.number,
  totalRaisedSms: PropTypes.number,
  totalRaised: PropTypes.number,
  giftAid: PropTypes.number
});
