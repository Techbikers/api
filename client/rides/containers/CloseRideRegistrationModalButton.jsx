import React, { PropTypes } from "react";
import { connect } from "react-redux";
import cx from "classnames";

import { closeRideRegistrationModal } from "techbikers/rides/actions/ui";

const mapDispatchToProps = {
  handleOnClick: closeRideRegistrationModal
};

const CloseRideRegistrationModalButton = ({ handleOnClick, className, text }) => (
  <button className={cx("btn", className)} onClick={() => handleOnClick()}>
    {text}
  </button>
);

CloseRideRegistrationModalButton.propTypes = {
  handleOnClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  text: PropTypes.string
};

export default connect(null, mapDispatchToProps)(CloseRideRegistrationModalButton);
