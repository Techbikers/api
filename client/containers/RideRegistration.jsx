import React, { Component } from "react";
import { FormattedNumber } from "react-intl";
import { connect } from "react-redux";

import {
  getRideRegistrationDetails,
  openRideRegistrationModal,
  closeRideRegistrationModal } from "../actions/ride";
import {
  getAuthenticatedUser,
  getRegistrationForCurrentRideAndUser } from "../selectors/user";
import { getCurrentRide } from "../selectors/ride";
import { getChapterForCurrentRide } from "../selectors/chapter";

import RideRegistrationModal from "../components/RideRegistrationModal";
import RegistrationSteps from "../components/RegistrationSteps";

const mapStateToProps = (state) => {
  const { rideRegistrationModal } = state.page.ui;
  const { errors } = state;

  return {
    ride: getCurrentRide(state),
    user: getAuthenticatedUser(state),
    chapter: getChapterForCurrentRide(state),
    registration: getRegistrationForCurrentRideAndUser(state),
    rideRegistrationModal,
    errors
  }
}

@connect(mapStateToProps)
export default class RideRegistration extends Component {
  componentWillMount() {
    const { dispatch, user, ride } = this.props;

    if (user && ride) {
      dispatch(getRideRegistrationDetails(ride.id, user.id));
    }
  }

  componentWillUpdate(nextProps) {
    const { registration } = this.props;
    const { dispatch, user, ride, registration: nextRegistration } = nextProps;

    if (user && ride && !nextRegistration) {
      dispatch(getRideRegistrationDetails(ride.id, user.id));
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
          <RegistrationSteps step={3} state="failed"/>
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

  renderRejectedRegistration() {
    return (
      <div className="ride-registration--container ride-registration--popdown">
        <header className="header-btn">
          <a className="btn">No invite</a>
        </header>
        <div className="ride-registration--content">
          <RegistrationSteps step={2} state="failed"/>
          <div className="ride-registration--details">
            <p>
              Due to exceptional demand we've been unable to invite you to join the ride.
              Sorry if this is a disappointing outcome but we hope you'll apply to join
              another Techbikers ride in the future!</p>
          </div>
        </div>
      </div>
    );
  }

  renderCompleteRegistration() {
    const { dispatch } = this.props;

    return (
      <div className="ride-registration--container ride-registration--popdown">
        <header className="header-btn">
          <a className="btn btn-grey">You've been invited to join!</a>
        </header>
        <div className="ride-registration--content">
          <RegistrationSteps step={3} state="pending"/>
          <div className="ride-registration--details">
            <p>
              Good news - you've been invited to join the ride. You now need to confirm
              and pay the registration fee before your invite expires.</p>
          </div>
          <a className="btn btn-green" onClick={() => dispatch(openRideRegistrationModal())}>Complete Registration</a>
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
    const { dispatch } = this.props;

    return (
      <div className="ride-registration--container">
        <header className="header-btn">
          <a className="btn btn-green" onClick={() => dispatch(openRideRegistrationModal())}>Sign up for the ride!</a>
        </header>
      </div>
    );
  }

  renderContent() {
    const { ride, registration } = this.props;

    if (ride.spaces_left < 1) {
      // Registration is closed as there are no more spaces on the ride
      // (doesn't matter if the ride requires pre-registration)
      return this.renderRideFull();
    }

    if (registration) {
      const { status, expired } = registration;

      switch (status) {
        case "PEN":
          // The logged in rider has a pending registration for this ride.
          // This means they are waiting to be accepted so they can then
          // complete their registration.
          return this.renderPendingRegistration();
          break;

        case "ACC":
          // The current rider has been accepted onto the ride. If their invite
          // to register hasn't expired then show them a form to complete signup.
          if (expired) {
            return this.renderExpiredRegistration();
            break;
          }

          return this.renderCompleteRegistration();
          break;

        case "REG":
          // The logged in rider has already signed up for the ride and
          // is confirmed as fully registered. No need to do anything
          // but get on that bike and train!
          return this.renderCompletedRegistration();
          break;

        case "REJ":
          return this.renderRejectedRegistration();
          break;
      }
    } else {
      return this.renderStartRegistration();
    }
  }

  render() {
    const { ride } = this.props;
    const { rideRegistrationModal, ...props } = this.props;

    if (ride && ride.is_over) {
      return null;
    }

    return (
      <section id="ride-registration">
        {this.renderContent()}

        {rideRegistrationModal &&
          <RideRegistrationModal isOpen={rideRegistrationModal} {...props} />}
      </section>
    );
  }
}