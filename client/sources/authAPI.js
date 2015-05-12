import _ from 'lodash';
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
}

export default AuthHttpAPI;