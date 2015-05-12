import _ from 'lodash';
import Marty from 'marty';
import ActionConstants from '../constants/actionConstants';

class RideQueries extends Marty.Queries {
  getAllRides() {
    return this.app.rideAPI.getAllRides().then(rides => {
      this.dispatch(ActionConstants.RECEIVE_RIDES, rides);
    });
  }

  getRide(id) {
    return this.app.rideAPI.getRide(id).then(ride => {
      this.dispatch(ActionConstants.RECEIVE_RIDES, ride);
    });
  }

  getRidesForRider(riderId) {
    return this.app.rideAPI.getRidesForRider(riderId).then(rides => {
      this.dispatch(ActionConstants.RECEIVE_RIDES, rides);
    });
  }
}

export default RideQueries;