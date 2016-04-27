import React, { Component, PropTypes } from "react";
import { FormattedNumber } from "react-intl";
import Modal from "react-modal";

import { modalStyles } from "../utils/modal";
import requireAuthentication from "../containers/requireAuthentication";
import { closeRideRegistrationModal } from "../actions/ride";

import PreRegistrationForm from "./PreRegistrationForm";
import CompleteRegistrationForm from "./CompleteRegistrationForm";

@requireAuthentication()
export default class RideRegistrationModal extends Component {
  static propTypes = {
    ride: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    registration: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    isOpen: PropTypes.bool
  };

  static defaultProps = {
    isOpen: false
  };

  render() {
    const { dispatch, isOpen, onRequestClose, ...props } = this.props;

    return (
      <Modal style={modalStyles} isOpen={isOpen} onRequestClose={() => dispatch(closeRideRegistrationModal())}>
        {this.renderContents()}
      </Modal>
    );
  }

  renderContents() {
    const { dispatch, registration } = this.props;

    if (!registration) {
      return <PreRegistrationForm {...this.props} />;
    }

    switch (registration.status) {
      case "ACC":
        return <CompleteRegistrationForm {...this.props} />;

      case "PEN":
        return (
          <div className="ride-registration--form">
            <p>
              Awesome - we've received your application to join this ride. You'll hear from us soon
              so in the meantime, why not jump on your bike and go for a ride.</p>
            <button className="btn btn-green" onClick={() => dispatch(closeRideRegistrationModal())}>
              Great!
            </button>
          </div>
        );

      case "REG":
        return (
          <div className="ride-registration--form">
            <p>
              You're all set! You've completed registration and we've received payment - all that's left
              to do now is fundraise and train!</p>
            <button className="btn btn-grey" onClick={() => dispatch(closeRideRegistrationModal())}>
              Great!
            </button>
          </div>
        );
    }
  }
}