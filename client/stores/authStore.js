import _ from 'lodash';
import Marty, { Store } from 'marty';
import jwt_decode from 'jwt-decode';

import ActionConstants from '../constants/actionConstants';

class AuthStore extends Store {
  constructor(options) {
    super(options);
    this.state = {
      error: null,
      token: false,
      user: false,
      passwordReset: false,
      partialUser: {}
    };
    this.handlers = {
      login: ActionConstants.AUTH_USER_LOGIN,
      loginFailed: ActionConstants.AUTH_USER_LOGIN_FAILED,
      logout: ActionConstants.AUTH_USER_LOGOUT,
      updatePartialUser: ActionConstants.RECEIVE_PARTIAL_USER,
      clearPartialUser: ActionConstants.AUTH_USER_LOGIN,
      setPasswordReset: ActionConstants.AUTH_PASSWORD_RESET,
      setError: [
        ActionConstants.AUTH_PASSWORD_RESET_FAILED,
        ActionConstants.AUTH_USER_LOGIN_FAILED],
      clearError: [
        ActionConstants.AUTH_CLEAR_ERROR,
        ActionConstants.AUTH_PASSWORD_RESET_STARTING,
        ActionConstants.AUTH_USER_LOGIN_STARTING]
    };
  }

  setError(error) {
    this.setState({
      error: error
    });
  }

  clearError() {
    this.setState({
      error: null
    });
  }

  login(token) {
    this.app.localStorage.setToken(token);
    this.replaceState({
      token: token,
      user: jwt_decode(token)
    });
  }

  loginFailed(exception) {
    this.setState({
      error: exception
    });
  }

  logout() {
    this.app.localStorage.clearToken();
    this.replaceState({
      token: null,
      user: null
    });
  }

  setPasswordReset(value) {
    this.setState({
      passwordReset: value
    });
  }

  updatePartialUser(user) {
    let partialUser = _.pick(
      _.extend(this.state.partialUser, user),
      ['first_name', 'last_name', 'email', 'company', 'twitter', 'website']);
    this.setState({
      partialUser: partialUser
    });
  }

  clearPartialUser() {
    this.setState({
      partialUser: {}
    });
  }

  isLoggedIn() {
    return !!this.state.user;
  }

  get user() {
    return this.state.user;
  }

  get partialUser() {
    return this.state.partialUser;
  }

  get token() {
    return this.state.token;
  }

  get error() {
    return this.state.error;
  }

  get passwordReset() {
    return this.state.passwordReset;
  }
}

export default AuthStore;