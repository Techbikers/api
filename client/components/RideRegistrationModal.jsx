import React, { Component, PropTypes } from "react";
import { FormattedNumber } from "react-intl";
import Modal from "react-modal";

import { modalStyles } from "../utils/modal";
import requireAuthentication from "../containers/requireAuthentication";
import { closeRideRegistrationModal } from "../actions/ride";

import SetupFundraising from "./SetupFundraising";
import PreRegistrationForm from "./PreRegistrationForm";
import CompleteRegistrationForm from "./CompleteRegistrationForm";

@requireAuthentication()
export default class RideRegistrationModal extends Component {
  static propTypes = {
    ride: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    fundraiser: PropTypes.object,
    registration: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired
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
    const { dispatch, registration, fundraiser } = this.props;

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
        if (!fundraiser) {
          return (
            <div className="ride-registration--form">
              <p>
                You're all set! You've completed registration and we've received payment - all that's left
                to do now is to setup your fundraising page and train!</p>
              <SetupFundraising {...this.props} />
              <button className="btn btn-grey" style={{marginLeft: 10}} onClick={() => dispatch(closeRideRegistrationModal())}>Not right now</button>
            </div>
          );
        } else {
          return (
            <div className="ride-registration--form">
              <p>
                Nice work - that's all from us. On your bike and let's change lives!</p>
              <button className="btn btn-grey" onClick={() => dispatch(closeRideRegistrationModal())}>OK!</button>
            </div>
          );
        }
    }
  }
}