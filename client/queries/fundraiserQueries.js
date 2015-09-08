import _ from 'lodash';
import Marty from 'marty';
import ActionConstants from '../constants/actionConstants';

class FundraiserQueries extends Marty.Queries {
  getActiveFundraisers() {
    return this.app.fundraiserAPI.getActiveFundraisers().then(fundraisers => {
      this.dispatch(ActionConstants.RECEIVE_FUNDRAISERS, fundraisers);
    });
  }
}

export default FundraiserQueries;