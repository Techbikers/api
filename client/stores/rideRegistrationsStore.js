import _ from "lodash";
import format from "util";
import Marty from "marty";
import ActionConstants from "../constants/actionConstants";

// ## Ride Registrations Store
// This stores the registration details for each ride for one user only
// (assumed to be the logged in user). This allows us to check the status
// of the logged in users registration for a ride so we can show them
// appropriate options regarding registering for the ride.

class RideRegistrationsStore extends Marty.Store {
  constructor(options) {
    super(options);
    this.state = {};
    this.handlers = {
      addRegistrationDetails: [ActionConstants.RECEIVE_RIDE_REGISTRATION, ActionConstants.CREATE_RIDE_REGISTRATION],
      updateRegistrationDetails: ActionConstants.UPDATE_RIDE_REGISTRATION,
      clear: ActionConstants.AUTH_USER_LOGOUT
    };
  }

  getRegistrationDetails(rideId, riderId) {
    return this.fetch({
      id: rideId,
      locally() {
        return this.state[rideId];
      },
      remotely() {
        return this.app.rideQueries.getRideRegistrationDetails(rideId, riderId);
      }
    });
  }

  addRegistrationDetails(rideId, registration) {
    this.state[rideId] = registration;
    this.hasChanged();
  }

  updateRegistrationDetails(rideId, registration) {
    this.state[rideId] = _.extend(this.state[rideId], registration);
    this.hasChanged();
  }
}

export default RideRegistrationsStore;