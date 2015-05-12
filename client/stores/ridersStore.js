import _ from "lodash";
import Marty from "marty";
import ActionConstants from "../constants/actionConstants";

class RidersStore extends Marty.Store {
  constructor(options) {
    super(options);
    this.state = {};
    this.handlers = {
      addRiders: ActionConstants.RECEIVE_RIDERS,
      addRider: ActionConstants.CREATE_RIDER,
      updateRider: ActionConstants.CREATE_RIDER_DONE
    };
  }

  getAll() {
    return this.fetch({
      id: 'all-riders',
      locally() {
        if (this.hasAlreadyFetched('all-riders')) {
          return this.state;
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
        return this.state[id];
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
          return _.filter(this.state, (rider) => {
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
      this.state[rider.id] = rider;
    });

    this.hasChanged();
  }

  updateRider(id, rider) {
    var oldRider = this.state[id];

    if (oldRider) {
      this.state[id] = _.extend(oldRider, rider);
      this.hasChanged();
    }
  }
}

export default RidersStore;