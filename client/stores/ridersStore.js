import _ from "lodash";
import Marty from "marty";
import ActionConstants from "../constants/actionConstants";

class RidersStore extends Marty.Store {
  constructor(options) {
    super(options);
    this.state = {
      error: null,
      riders: {}
    };
    this.handlers = {
      addRiders: ActionConstants.RECEIVE_RIDERS,
      addRider: ActionConstants.CREATE_RIDER_DONE,
      addRiderFailed: ActionConstants.CREATE_RIDER_FAILED,
      updateRider: ActionConstants.UPDATE_RIDER_DONE,
      clearError: [
        ActionConstants.CHANGE_ROUTE,
        ActionConstants.CREATE_RIDER_STARTING,
        ActionConstants.UPDATE_RIDER_STARTING]
    };
  }

  getAll() {
    return this.fetch({
      id: 'all-riders',
      locally() {
        if (this.hasAlreadyFetched('all-riders')) {
          return this.state.riders;
        }
      },
      remotely() {
        return this.app.riderQueries.getAllRiders();
      }
    });
  }

  getRider(id) {
    return this.fetch({
      id: id,
      locally() {
        return this.state.riders[id];
      },
      remotely() {
        return this.app.riderQueries.getRider(id);
      }
    });
  }

  getRidersForRide(rideId) {
    return this.fetch({
      id: rideId,
      locally() {
        if (this.hasAlreadyFetched(rideId) || this.hasAlreadyFetched('all-riders')) {
          return _.filter(this.state.riders, (rider) => {
            return _.includes(rider.rides, parseInt(rideId));
          });
        }
      },
      remotely() {
        return this.app.riderQueries.getRidersForRide(rideId);
      }
    })
  }

  addRider(rider) {
    this.addRiders([rider]);
  }

  addRiders(riders) {
    if (!_.isArray(riders)) {
      riders = [riders];
    }

    _.each(riders, (rider) => {
      this.state.riders[rider.id] = rider;
    });

    this.hasChanged();
  }

  addRiderFailed(rider, error) {
    this.setState({
      error: error
    });
  }

  updateRider(id, rider) {
    var oldRider = this.state.riders[id];

    if (oldRider) {
      this.state.riders[id] = _.extend(oldRider, rider);
      this.hasChanged();
    }
  }

  clearError() {
    this.setState({
      error: null
    });
  }

  get error() {
    return this.state.error;
  }
}

export default RidersStore;