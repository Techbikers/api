import _ from "lodash";
import React, { Component } from "react";
import Marty from "marty";
import { FormattedNumber } from "react-intl";
import forms, { Form, RenderForm } from 'newforms';

import Errors from "./errors.jsx";
import PaymentForm from "./paymentForm.jsx";
import Timestamp from "./timestamp.jsx";
import Spinner from "./spinner.jsx";
import RegistrationSteps from "./registrationSteps.jsx";

class CompleteRegistrationForm extends Component {

  static propTypes = {
    ride: React.PropTypes.object.isRequired,
    currentRider: React.PropTypes.object.isRequired,
    currentRiderRegistration: React.PropTypes.object.isRequired
  }

  constructor(options) {
    super(options);
    this.state = {
      loading: false,
    }
  }

  // Register the current user for the ride
  chargeUser(details) {
    this.setState({ loading: true });
    Stripe.setPublishableKey(this.props.ride.chapter.public_key);
    Stripe.card.createToken(details, (status, res) => {
      if (res.error) {
        this.setState({ loading: false, error: res.error });
      } else {
        this.app.rideActions.chargeRider(this.props.currentRiderRegistration, res.id, details.amount);
      }
    });
  }

  render() {
    let { ride, currentRider, currentRiderRegistration } = this.props;

    if (!this.state.loading) {
      return (
        <div className="ride-registration--form">
          <RegistrationSteps step={3} />
          <div className="ride-registration--details">
            {currentRiderRegistration.signup_expires ?
              <p>
              Great news - we'd love to have you as part of the TechBikers 2015 ride.
              Congratulations! <b>You have until <Timestamp format="D MMM" value={currentRiderRegistration.signup_expires} /> to
              register.</b> After this you may lose your spot to someone else.</p>
            :
              <p>
                Great news - we'd love to have you as part of the TechBikers 2015 ride.</p>}
            <p>
              The ride costs about <FormattedNumber style="currency" currency={ride.currency} value={ride.full_cost} /> per rider.
              We're asking for a minimum contribution of <FormattedNumber style="currency" currency={ride.currency} value={ride.price} />.
              If you are able, we welcome you to pay more. This means more sponsor money goes directly to Room to Read!</p>

            <Errors error={this.state.error} />
          </div>
          <PaymentForm submitText="Make payment & complete registration" onSubmit={this.chargeUser.bind(this)} customAmount={true} minAmount={ride.price} />
        </div>
      );
    } else {
      return (
        <div className="ride-registration--form">
          <Spinner />
        </div>
      );
    }
  }
}

export default Marty.createContainer(CompleteRegistrationForm);