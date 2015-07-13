import _ from "lodash";
import React, { Component } from "react";
import Marty from "marty";
import { FormattedNumber } from "react-intl";
import { Link } from "react-router";

import RideUtils from "../utils/rideUtils";
import RideActions from "../actions/rideActions";
import AuthStore from "../stores/authStore";
import RidersStore from "../stores/ridersStore";

import PreRegistrationForm from "./preRegistrationForm.jsx";
import CompleteRegistrationForm from "./completeRegistrationForm.jsx";
import PaymentForm from "./paymentForm.jsx";
import RegistrationSteps from "./registrationSteps.jsx";

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
          <RegistrationSteps step={2} state="pending" />
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
        <header className="header-btn">
          <a className="btn">Invite Expired</a>
        </header>
        <div className="ride-registration--content">
          <RegistrationSteps step={2} state="failed"/>
          <div className="ride-registration--details">
            <p>
              Unfortunately your invite to register for this ride has now expired. Demand for our rides
              is always high so if you fail to accept the invite to register for the ride then we give
              your spot to someone else on the waiting list.</p>
          </div>
        </div>
      </div>
    );
  }

  renderCompleteRegistration() {
    return (
      <div className="ride-registration--container ride-registration--popdown">
        <header className="header-btn">
          <a className="btn btn-grey">Complete Registration</a>
        </header>
        <div className="ride-registration--content">
          <CompleteRegistrationForm {...this.props} />
        </div>
      </div>
    );
  }

  renderCompletedRegistration() {
    return (
      <div className="ride-registration--container ride-registration--popdown">
        <header className="header-btn">
          <a className="btn">You're signed up for the ride!</a>
        </header>
        <div className="ride-registration--content">
          <RegistrationSteps step={4}/>
        </div>
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
        {this.app.authStore.isLoggedIn() ? "" :
          <span className="more-info">
            <Link to="login" query={{"next": this.app.router.getCurrentPath()}}>Already have an account? Login</Link>
          </span>}
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