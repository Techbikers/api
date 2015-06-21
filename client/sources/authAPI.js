import _ from 'lodash';
import format from "util";
import Marty, { HttpStateSource } from 'marty';

class AuthHttpAPI extends HttpStateSource {
  login(email, password) {
    return this.post({
      url: '/api/auth/token',
      body: {
        username: email,
        password: password
      }
    }).then(res => {
      return res.json();
    });
  }

  refreshToken(token) {
    return this.post({
      url: '/api/auth/token-refresh',
      body: {
        token: token
      }
    }).then(res => {
      return res.json();
    });
  }

  changePassword(email, password, newpassword1, newpassword2) {
    return this.post({
      url: '/api/auth/change-password'
    }).then(res => {
      return res.json();
    });
  }

  resetPassword(uid, token, newpassword1, newpassword2) {
    return this.post({
      url: '/api/auth/password/reset/confirm',
      body: {
        uid: uid,
        token: token,
        new_password1: newpassword1,
        new_password2: newpassword2
      }
    }).then(res => {
      if (!res.ok) {
        throw Error(res.status);
      }
      return res.json();
    })
  }

  emailResetPasswordLink(email) {
    return this.post({
      url: '/api/auth/password/reset',
      body: {
        email: email
      }
    }).then(res => {
      if (!res.ok) {
        throw Error(res.status);
      }
      return res.json();
    })
  }
}

export default AuthHttpAPI;