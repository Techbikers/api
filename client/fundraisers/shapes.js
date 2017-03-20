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
  fundraisingTarget: PropTypes.string,
  totalRaisedOffline: PropTypes.string,
  totalRaisedOnline: PropTypes.string,
  totalRaisedSms: PropTypes.string,
  totalRaised: PropTypes.string,
  giftAid: PropTypes.string
});
