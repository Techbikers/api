import _ from 'lodash';
import Marty from 'marty';
import ActionConstants from '../constants/actionConstants';

class SponsorQueries extends Marty.Queries {
  getAllSponsors() {
    return this.app.sponsorAPI.getAllSponsors().then(
      sponsors => {
        this.dispatch(ActionConstants.RECEIVE_SPONSORS, sponsors);
      },
      error => {
        this.dispatch(ActionConstants.RECEIVE_SPONSORS_FAILED, error);
      });
  }

  getSponsor(id) {
    return this.app.sponsorAPI.getSponsor(id).then(
      sponsor => {
        this.dispatch(ActionConstants.RECEIVE_SPONSORS, sponsor);
      },
      error => {
        this.dispatch(ActionConstants.RECEIVE_SPONSORS_FAILED, error, id);
      });
  }

  getSponsorsForRide(rideId) {
    return this.app.sponsorAPI.getSponsorsForRide(rideId).then(
      sponsors => {
        this.dispatch(ActionConstants.RECEIVE_SPONSORS, sponsors);
      },
      error => {
        this.dispatch(ActionConstants.RECEIVE_SPONSORS_FAILED, error, id);
      });
  }
}

export default SponsorQueries;