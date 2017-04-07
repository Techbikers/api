import { connect } from "react-redux";

import { chargeUserForRide } from "techbikers/rides/actions";
import { getChapterForCurrentRide } from "techbikers/chapters/selectors";
import { getCurrentRide, getRegistrationForCurrentRideAndUser } from "techbikers/rides/selectors";

import CompleteRegistrationForm from "techbikers/rides/components/CompleteRegistrationForm";

const mapStateToProps = state => ({
  ride: getCurrentRide(state),
  chapter: getChapterForCurrentRide(state),
  registration: getRegistrationForCurrentRideAndUser(state),
  paymentProcessing: state.rides.registrationState === "processing"
});

const mapDispatchToProps = dispatch => ({
  chargeUserForRide: (rideId, userId, amount, cardDetails, publicKey) =>
    dispatch(chargeUserForRide(rideId, userId, amount, cardDetails, publicKey))
});

const mergeProps = (stateProps, dispatchProps) => {
  // We can get the id's of the ride and user for which we are processing
  // payment from the registration record
  const { ride, user } = stateProps.registration;
  const { publicKey } = stateProps.chapter;

  return {
    ...stateProps,
    handlePayment: (amount, cardDetails) =>
      dispatchProps.chargeUserForRide(ride, user, amount, cardDetails, publicKey)
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CompleteRegistrationForm);
