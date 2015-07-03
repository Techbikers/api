import _ from "lodash";
import React, { Component } from "react";
import Marty from "marty";
import { FormattedNumber } from "react-intl";

import RideUtils from "../utils/rideUtils";
import RideActions from "../actions/rideActions";
import AuthStore from "../stores/authStore";
import RidersStore from "../stores/ridersStore";

import PreRegistrationForm from "./preRegistrationForm.jsx";
import PaymentForm from "./paymentForm.jsx";

class RideRegistration extends Component {
  static propTypes = {
    ride: React.PropTypes.object.isRequired,
    currentRider: React.PropTypes.object.isRequired
  }

  constructor(options) {
    super(options);
    this.state = {
      inProgress: false
    };
  }

  toggleRegistrationState() {
    if (!this.app.authStore.isLoggedIn()) {
      this.app.navigationActions.navigateTo('signup', {}, {next: this.app.router.getCurrentPath()});
    } else {
      this.setState({
        inProgress: !this.state.inProgress
      });
    }
  }

  renderRideFull() {
    return (
      <div className="ride-registration--container">
        <header className="header-btn">
          <a className="btn">Now sold out</a>
        </header>
        <span className="more-info">
          Registration for this ride has closed as it is now sold out
        </span>
      </div>
    );
  }

  renderPendingRegistration() {
    return (
      <div className="ride-registration--container ride-registration--popdown">
        <header className="header-btn">
          <a className="btn">Waiting for invite...</a>
        </header>
        <div className="ride-registration--content">
          <ol className="steps">
            <li className="done">
              <span className="material-icons">done</span>
              <span>Register Interest</span>
            </li>
            <li className="pending">
              <span className="material-icons">schedule</span>
              <span>Invites Sent</span>
            </li>
            <li>
              <span>3</span>
              <span>Confirm & Pay</span>
            </li>
          </ol>
          <div className="ride-registration--details">
            <p>
              We've received your application to join this ride. You'll hear from us soon
              so in the meantime, why not jump on your bike and go for a ride?</p>
          </div>
        </div>
      </div>
    );
  }

  renderExpiredRegistration() {
    return (
      <div className="ride-registration--container ride-registration--popdown">
        <h2>Oh dear. You were invited to join the ride but your invite has now expired.</h2>
      </div>
    );
  }

  renderCompleteRegistration() {
    return (
      <div className="ride-registration--container ride-registration--popdown">
        <h2>Awesome news – you've been invited to take part on this ride!</h2>
      </div>
    );
  }

  renderCompletedRegistration() {
    return (
      <div className="ride-registration--container ride-registration--popdown">
        <h2>Good job {this.props.currentRider.first_name}! You're signed up for this ride!</h2>
      </div>
    );
  }

  renderStartRegistration() {
    // The user hasn't yet started the registration process so show them a button
    // which kicks it off
    return (
      <div className="ride-registration--container">
        <header className="header-btn">
          <a className="btn btn-green" onClick={this.toggleRegistrationState.bind(this)}>Sign up for the ride!</a>
        </header>
      </div>
    );
  }

  renderPreRegistration() {
    // Registration is in progress so show the whole form and information
    // If the user already a member of Techbikers then just show them
    // information and confirm that they want to to register for the ride.
    // Else, explain that they need to sign up for membership and then they
    // will be registered for the ride.
    return (
      <div className="ride-registration--container ride-registration--popdown">
        <header className="header-btn">
          <a className="btn btn-grey" onClick={this.toggleRegistrationState.bind(this)}>Apply to join the ride</a>
        </header>
        <div className="ride-registration--content">
          <PreRegistrationForm {...this.props} />
        </div>
      </div>
    );
  }

  render() {
    let { ride, currentRider, currentRiderRegistration } = this.props;

    if (!ride.is_over) {
      let content = () => {
        if (ride.spaces_left < 1) {
          // Registration is closed as there are no more spaces on the ride
          // (doesn't matter if the ride requires pre-registration)
          return this.renderRideFull();

        } else if (currentRiderRegistration.status == "PEN") {
          // The logged in rider has a pending registration for this ride.
          // This means they are waiting to be accepted so they can then
          // complete their registration.
          return this.renderPendingRegistration();

        } else if (currentRiderRegistration.status == "ACC") {
          // The current rider has been accepted onto the ride. If their invite
          // to register hasn't expired then show them a form to complete signup.
          if (!currentRiderRegistration.expired) {
            return this.renderCompleteRegistration();
          } else {
            return this.renderExpiredRegistration();
          }

        } else if (currentRiderRegistration.status == "REG") {
            // The logged in rider has already signed up for the ride and
            // is confirmed as fully registered. No need to do anything
            // but get on that bike and train!
            return this.renderCompletedRegistration();

        } else {
          // Anyone is free to register/pre-register for the ride!
          if (!this.state.inProgress) {
            return this.renderStartRegistration();
          } else {
            return this.renderPreRegistration();
          }
        }
      };

      // Return the final component with the right contents
      return (
        <section id="ride-registration">
          {content()}
        </section>
      );

    } else {
      // No need to show anything if the ride is over
      return null;
    }
  }
}

RideRegistration = Marty.createContainer(RideRegistration, {
  listenTo: ['rideRegistrationsStore', 'authStore'],
  fetch: {
    currentRiderRegistration() {
      if (this.app.authStore.isLoggedIn()) {
        return this.app.rideRegistrationsStore.getRegistrationDetails(this.props.ride.id, this.app.authStore.user.user_id);
      } else {
        return {};
      }
    }
  }
});

export default RideRegistration;