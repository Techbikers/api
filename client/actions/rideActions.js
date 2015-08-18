import Marty, { ActionCreators } from "marty";
import ActionConstants from "../constants/actionConstants";

class RideActions extends ActionCreators {

  registerRider(ride, payload=null, token=null) {
    this.dispatch(ActionConstants.CREATE_RIDE_REGISTRATION_STARTING, ride, payload);

    // Register the user for the ride (this will register them in the pending state
    // so no charge is made to their card)
    this.app.rideAPI.registerRider(ride.id, payload, token).then(
      result => {
        this.dispatch(ActionConstants.CREATE_RIDE_REGISTRATION, ride.id, result);
      },
      error => {
        this.dispatch(ActionConstants.CREATE_RIDE_REGISTRATION_FAILED, ride, error);
      });
  }

  chargeRider(registration, token=null, amount=null) {
    this.dispatch(ActionConstants.UPDATE_RIDE_REGISTRATION_STARTING, registration);

    // Register the user for the ride (this will register them in the pending state
    // so no charge is made to their card)
    this.app.rideAPI.chargeRider(registration.ride, registration.user, token, amount).then(
      result => {
        this.dispatch(ActionConstants.UPDATE_RIDE_REGISTRATION, registration.ride, result);
      },
      error => {
        this.dispatch(ActionConstants.UPDATE_RIDE_REGISTRATION_FAILED, registration.ride, registration, error);
      });
  }

  createFundraisingPage(ride, rider, email = null, password = null) {
    this.dispatch(ActionConstants.CREATE_FUNDRAISING_PAGE_STARTING);

    this.app.rideAPI.createFundraisingPage(ride.id, rider.id, email, password).then(
      result => {
        this.dispatch(ActionConstants.CREATE_FUNDRAISING_PAGE, result);

        // Update the rider fundraisers
        rider.fundraisers.push(result);
        this.dispatch(ActionConstants.UPDATE_RIDER_DONE, rider.id, rider);
      },
      error => {
        this.dispatch(ActionConstants.CREATE_FUNDRAISING_PAGE_FAILED);
      });
  }
}

export default RideActions;