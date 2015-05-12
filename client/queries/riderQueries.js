import _ from 'lodash';
import Marty from 'marty';
import ActionConstants from '../constants/actionConstants';

class RiderQueries extends Marty.Queries {
  getAllRiders() {
    return this.app.riderAPI.getAllRiders().then(riders => {
      this.dispatch(ActionConstants.RECEIVE_RIDERS, riders);
    });
  }

  getRider(id) {
    return this.app.riderAPI.getRider(id).then(rider => {
      this.dispatch(ActionConstants.RECEIVE_RIDERS, rider);
    });
  }

  getRidersForRide(rideId) {
    return this.app.riderAPI.getRidersForRide(rideId).then(riders => {
      this.dispatch(ActionConstants.RECEIVE_RIDERS, riders);
    });
  }
}

export default RiderQueries;