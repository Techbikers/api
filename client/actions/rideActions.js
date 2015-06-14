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
}

export default RideActions;