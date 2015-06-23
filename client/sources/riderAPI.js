import _ from "lodash";
import { format } from "util";
import Marty, { HttpStateSource } from "marty";
import { ResponseError } from "../utils/customErrors";

class RiderHttpAPI extends HttpStateSource {
  getAllRiders() {
    return this.get('/api/riders').then(res => {
      return res.json();
    });
  }

  getRider(id) {
    return this.get(format('/api/riders/%d', id)).then(res => {
      return res.json();
    });
  }

  getRidersForRide(rideId) {
    return this.get(format('/api/rides/%d/riders', rideId)).then(res => {
      return res.json();
    });
  }

  // ## Rider Creation
  // This is what we use to create new user accounts as riders
  // and users are the same thing.
  createRider(rider) {
    return this.post({
      url: '/api/riders',
      body: rider
    }).then(res => {
      if (!res.ok) {
        return res.json().then(details => {
          throw new ResponseError("Failed to create new rider", res.status, details);
        });
      } else {
        return res.json();
      }
    });
  }

  updateRider(rider) {
    return this.patch({
      url: format('/api/riders/%d', rider.id),
      body: rider
    }).then(res => {
      if (!res.ok) {
        return res.json().then(details => {
          throw new ResponseError("Failed to update rider", res.status, details);
        });
      }
      return res.json();
    });
  }
}

export default RiderHttpAPI;