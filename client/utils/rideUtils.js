import _ from "lodash";

const RideUtils = {

  // Find any rides that any two riders have been on together
  riddenTogether: function(rider1, rider2) {
    return _.intersection(rider1.rides, rider2.rides);
  },

  // Determine whether a rider is on a ride
  signedUp: function(rider, ride) {
    return _.includes(ride.riders, parseInt(rider.id));
  }

}

export default RideUtils;