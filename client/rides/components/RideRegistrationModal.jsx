import React, { Component, PropTypes } from "react";
import Modal from "react-modal";

import { modalStyles } from "techbikers/utils/modal";
import requireAuthentication from "techbikers/auth/containers/requireAuthentication";
import { closeRideRegistrationModal } from "techbikers/rides/actions";
import { RideShape, RegistrationShape } from "techbikers/rides/shapes";
import { UserShape } from "techbikers/users/shapes";
import { FundraiserShape } from "techbikers/fundraisers/shapes";

import SetupFundraising from "techbikers/fundraisers/components/SetupFundraising";
import PreRegistrationForm from "techbikers/rides/components/PreRegistrationForm";
import CompleteRegistrationForm from "techbikers/rides/components/CompleteRegistrationForm";

@requireAuthentication()
export default class RideRegistrationModal extends Component {
  static propTypes = {
    ride: RideShape.isRequired,
    user: UserShape.isRequired,
    fundraiser: FundraiserShape,
    registration: RegistrationShape,
    dispatch: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired
  };

  static defaultProps = {
    isOpen: false
  };

  render() {
    const { dispatch, isOpen } = this.props;

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
              `Awesome - we've received your application to join this ride. You'll hear from us soon
              so in the meantime, why not jump on your bike and go for a ride.`
            </p>
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
                to do now is to setup your fundraising page and train!
              </p>
              <SetupFundraising {...this.props} />
              <button className="btn btn-grey" style={{ marginLeft: 10 }} onClick={() => dispatch(closeRideRegistrationModal())}>Not right now</button>
            </div>
          );
        } else {
          return (
            <div className="ride-registration--form">
              <p>
                Nice work - that's all from us. On your bike and let's change lives!
              </p>
              <button className="btn btn-grey" onClick={() => dispatch(closeRideRegistrationModal())}>OK!</button>
            </div>
          );
        }

      default:
        return null;
    }
  }
}
