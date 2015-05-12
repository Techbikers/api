import _ from "lodash";
import { format } from "util";
import Marty, { HttpStateSource } from "marty";

class RideHttpAPI extends HttpStateSource {
  getAllRides() {
    return this.get('/api/rides').then(res => {
      return res.json();
    });
  }

  getRide(id) {
    return this.get(format('/api/rides/%d', id)).then(res => {
      return res.json();
    });
  }

  getRidesForRider(riderId) {
    return this.get(format('/api/riders/%d/rides', riderId)).then(res => {
      return res.json();
    });
  }
}

export default RideHttpAPI;