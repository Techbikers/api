import Marty, { ActionCreators } from 'marty';
import ActionConstants from '../constants/actionConstants';

class RiderActions extends ActionCreators {
  createRider(rider, autoLogin=true) {
    this.dispatch(ActionConstants.CREATE_RIDER_STARTING, rider);

    this.app.riderAPI.createRider(rider).then(
      newRider => {
        this.dispatch(ActionConstants.CREATE_RIDER_DONE, newRider);
        if (autoLogin) {
          this.app.authActions.login(rider.email, rider.password);
        }
      },
      error => {
        this.dispatch(ActionConstants.CREATE_RIDER_FAILED, rider, error);
      });
  }

  updateRider(rider) {
    this.dispatch(ActionConstants.UPDATE_RIDER_STARTING, rider);

    this.app.riderAPI.updateRider(rider).then(
      updatedRider => {
        this.dispatch(ActionConstants.UPDATE_RIDER_DONE, rider.id, updatedRider);
      },
      error => {
        this.dispatch(ActionConstants.UPDATE_RIDER_FAILED, rider, error);
      });
  }
}

export default RiderActions;