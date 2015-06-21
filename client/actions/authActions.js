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

  emailResetPasswordLink(email) {
    this.dispatch(ActionConstants.AUTH_PASSWORD_RESET_STARTING);
    this.app.authAPI.emailResetPasswordLink(email).then(
      res => {
        this.dispatch(ActionConstants.AUTH_PASSWORD_RESET, true);
      },
      error => {
        this.dispatch(ActionConstants.AUTH_PASSWORD_RESET_FAILED, error);
      });
  }

  resetPassword(uid, token, password1, password2) {
    this.dispatch(ActionConstants.AUTH_PASSWORD_RESET_STARTING);
    this.app.authAPI.resetPassword(uid, token, password1, password2).then(
      res => {
        this.dispatch(ActionConstants.AUTH_PASSWORD_RESET, true);
      },
      error => {
        this.dispatch(ActionConstants.AUTH_PASSWORD_RESET_FAILED, error);
      });
  }

  updatePartialUser(object) {
    this.dispatch(ActionConstants.RECEIVE_PARTIAL_USER, object);
  }

  clearError() {
    this.dispatch(ActionConstants.AUTH_CLEAR_ERROR);
  }
}

export default AuthActions;