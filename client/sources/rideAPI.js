import _ from "lodash";
import { format } from "util";
import Marty, { HttpStateSource } from "marty";
import { ResponseError } from "../utils/customErrors";

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

  getRideRegistrationDetails(rideId, riderId) {
    return this.get(format('/api/rides/%d/riders/%d', rideId, riderId)).then(res => {
      if (!res.ok) {
        if (res.status === 404) {
          return {};
        }

        throw Error(res.status);
      }
      return res.json();
    });
  }

  getRidesForRider(riderId) {
    return this.get(format('/api/riders/%d/rides', riderId)).then(res => {
      return res.json();
    });
  }

  registerRider(rideId, payload=null, token=null) {
    return this.post({
      url: format('/api/rides/%d/riders', rideId),
      body: {
        ride: rideId,
        payload: payload,
        token: token
      }
    }).then(res => {
      if (!res.ok) {
        throw Error(res.status);
      }
      return res.json();
    });
  }

  chargeRider(rideId, riderId, token=null, amount=null) {
    return this.put({
      url: `/api/rides/${rideId}/riders/${riderId}/charge`,
      body: {
        token: token,
        amount: amount,
        ride: rideId
      }
    }).then(res => {
      if (!res.ok) {
        throw ResponseError("Failed to charge card and complete registration", res.status, res);
      }
      return res.json();
    });
  }

  createFundraisingPage(rideId, riderId, email, password) {
    return this.post({
      url: `/api/rides/${rideId}/riders/${riderId}/fundraiser`,
      body: {
        ride: rideId,
        user: riderId,
        email: email,
        password: password
      }
    }).then(res => {
      if (!res.ok) {
        throw ResponseError("Failed to create fundraising page", res.status, res);
      }
      return res.json();
    });
  }
}

export default RideHttpAPI;