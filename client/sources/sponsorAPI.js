import _ from 'lodash';
import Marty, { HttpStateSource } from 'marty';

class SponsorHttpAPI extends HttpStateSource {
  getAllSponsors() {
    return this.get(`/api/sponsors`).then(res => {
      if (!res.ok)
        throw Error();
      return res.json();
    });
  }

  getSponsor(id) {
    return this.get(`/api/sponsors/${id}`).then(res => {
      if (!res.ok)
        throw Error();
      return res.json();
    });
  }

  getSponsorsForRide(rideId) {
    return this.get(`/api/rides/${rideId}/sponsors`).then(res => {
      if (!res.ok)
        throw Error();
      return res.json();
    });
  }
}

export default SponsorHttpAPI;