import Marty, { ActionCreators } from 'marty';
import ActionConstants from '../constants/actionConstants';

class NavigationActions extends ActionCreators {
  navigateHome() {
    this.navigateTo('home');
  }

  navigateToLogin(next=false) {
    if (next) {
      this.navigateTo('login', {}, {next: next});
    } else {
      this.navigateTo('login');
    }
  }

  changeRoute(state) {
    this.dispatch(ActionConstants.CHANGE_ROUTE, state);
  }

  navigateTo(route, params={}, query={}) {
    this.app.router.transitionTo(route, params, query);
  }
}

export default NavigationActions;