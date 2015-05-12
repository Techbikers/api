import _ from "lodash";
import Marty from "marty";
import ActionConstants from "../constants/actionConstants";

class RidesStore extends Marty.Store {
  constructor(options) {
    super(options);
    this.state = {};
    this.handlers = {
      addRides: ActionConstants.RECEIVE_RIDES
    };
  }

  getAll() {
    return this.fetch({
      id: 'all-rides',
      locally() {
        if (this.hasAlreadyFetched('all-rides')) {
          return this.state;
        }
      },
      remotely() {
        return this.app.rideQueries.getAllRides();
      }
    });
  }

  getCurrentRides() {
    return this.fetch({
      id: 'current-rides',
      dependsOn: this.getAll(),
      locally() {
        let now = _.now();
        return _.filter(this.state, (ride) => {
          return new Date(ride.end_date) >= now;
        });
      }
    });
  }

  getPastRides() {
    return this.fetch({
      id: 'past-rides',
      dependsOn: this.getAll(),
      locally() {
        let now = _.now();
        return _.filter(this.state, (ride) => {
          return new Date(ride.end_date) < now;
        });
      }
    });
  }

  getRidesForRider(riderId) {
    return this.fetch({
      id: riderId,
      locally() {
        if (this.hasAlreadyFetched(riderId) || this.hasAlreadyFetched('all-rides')) {
          return _.filter(this.state, (ride) => {
            return _.includes(ride.riders, parseInt(riderId));
          });
        }
      },
      remotely() {
        return this.app.rideQueries.getRidesForRider(riderId);
      }
    })
  }

  getRide(id) {
    return this.fetch({
      id: id,
      locally() {
        return this.state[id];
      },
      remotely() {
        return this.app.rideQueries.getRide(id);
      }
    });
  }

  addRide(ride) {
    this.addRides([ride]);
  }

  addRides(rides) {
    if (!_.isArray(rides)) {
      rides = [rides];
    }

    _.each(rides, (ride) => {
      this.state[ride.id] = ride;
    });

    this.hasChanged();
  }
}

export default RidesStore;