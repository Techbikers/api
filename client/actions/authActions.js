import Marty, { ActionCreators } from 'marty';
import ActionConstants from '../constants/actionConstants';

class AuthActions extends ActionCreators {
  login(email, password) {
    this.app.authAPI.login(email, password).then(res => {
      if (res.token) {
        this.dispatch(ActionConstants.AUTH_USER_LOGIN, res.token);
      } else {
        this.dispatch(ActionConstants.AUTH_USER_LOGIN_FAILED, email, res);
      }
    });
  }

  attemptReAuth() {
    let token = this.app.localStorage.getToken();
    if (token) {
      this.refreshToken(token);
    }
  }

  refreshToken(token) {
    this.app.authAPI.refreshToken(token).then(res => {
      if (res.token) {
        this.app.localStorage.setToken(res.token);
        this.dispatch(ActionConstants.AUTH_USER_LOGIN, res.token);
      } else {
        this.logout();
      }
    });
  }

  logout() {
    this.dispatch(ActionConstants.AUTH_USER_LOGOUT);
    this.app.navigationActions.navigateToLogin();
  }

  updatePartialUser(object) {
    this.dispatch(ActionConstants.RECEIVE_PARTIAL_USER, object);
  }
}

export default AuthActions;