import _ from 'lodash';
import { format } from "util";
import Marty, { HttpStateSource } from 'marty';

class FundraiserHttpAPI extends HttpStateSource {
  getActiveFundraisers() {
    return this.get('/api/fundraisers').then(res => {
      return res.json();
    });
  }
}

export default FundraiserHttpAPI;