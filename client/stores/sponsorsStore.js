import _ from "lodash";
import Marty from "marty";
import ActionConstants from "../constants/actionConstants";

class SponsorsStore extends Marty.Store {
  constructor(options) {
    super(options);
    this.state = {};
    this.handlers = {
      addSponsors: ActionConstants.RECEIVE_SPONSORS
    };
  }

  getAll() {
    return this.fetch({
      id: 'all-sponsors',
      locally() {
        if (this.hasAlreadyFetched('all-sponsors')) {
          return this.state;
        }
      },
      remotely() {
        return this.app.sponsorQueries.getAllSponsors();
      }
    });
  }

  getSponsor(id) {
    return this.fetch({
      id: id,
      locally() {
        return this.state[id];
      },
      remotely() {
        return this.app.sponsorQueries.getSponsor(id);
      }
    });
  }

  getSponsorsForRide(rideId) {
    return this.fetch({
      id: `ride-${rideId}`,
      locally() {
        if (this.hasAlreadyFetched('all-sponsors') || this.hasAlreadyFetched(`ride-${rideId}`)) {
          return _.filter(this.state, (sponsor) => {
            return _.filter(sponsor.rides, {"ride": rideId}).length > 0;
          });
        }
      },
      remotely() {
        return this.app.sponsorQueries.getSponsorsForRide(rideId);
      }
    });
  }

  addSponsor(sponsor) {
    this.addSponsors([sponsor]);
  }

  addSponsors(sponsors) {
    if (!_.isArray(sponsors)) {
      sponsors = [sponsors];
    }

    _.each(sponsors, (sponsor) => {
      this.state[sponsor.id] = sponsor;
    });

    this.hasChanged();
  }
}

export default SponsorsStore;