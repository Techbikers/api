import { connect } from "react-redux";

import { registerUserForRide } from "techbikers/rides/actions";
import { getCurrentRide } from "techbikers/rides/selectors";

import PreRegistrationForm from "techbikers/rides/components/PreRegistrationForm";

const mapStateToProps = state => ({
  ride: getCurrentRide(state)
});

const mapDispatchToProps = {
  registerUserForRide
};

export default connect(mapStateToProps, mapDispatchToProps)(PreRegistrationForm);
