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
      user: false
    };
    this.handlers = {
      login: ActionConstants.AUTH_USER_LOGIN,
      loginFailed: ActionConstants.AUTH_USER_LOGIN_FAILED,
      logout: ActionConstants.AUTH_USER_LOGOUT
    };
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

  isLoggedIn() {
    return !!this.state.user;
  }

  get user() {
    return this.state.user;
  }

  get token() {
    return this.state.token;
  }

  get error() {
    return this.state.error;
  }
}

export default AuthStore;