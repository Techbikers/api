import _ from "lodash";
import Marty from "marty";
import ActionConstants from "../constants/actionConstants";

class FundraisersStore extends Marty.Store {
  constructor(options) {
    super(options);
    this.state = {};
    this.handlers = {
      addFundraisers: ActionConstants.RECEIVE_FUNDRAISERS
    };
  }

  getActiveFundraisers() {
    return this.fetch({
      id: 'active-fundraisers',
      locally() {
        if (this.hasAlreadyFetched('active-fundraisers')) {
          return this.state;
        }
      },
      remotely() {
        return this.app.fundraiserQueries.getActiveFundraisers();
      }
    });
  }

  addFundraiser(fundraiser) {
    this.addRides([fundraiser]);
  }

  addFundraisers(fundraisers) {
    if (!_.isArray(fundraisers)) {
      fundraisers = [fundraisers];
    }

    _.each(fundraisers, (fundraiser) => {
      this.state[fundraiser.id] = fundraiser;
    });

    this.hasChanged();
  }
}

export default FundraisersStore;