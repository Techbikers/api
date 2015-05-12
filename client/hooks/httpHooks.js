import Marty from "marty";

Marty.HttpStateSource.addHook({
  id: 'addToken',

  before(req) {
    let token = this.app.authStore.token;
    if (token) {
      req.headers['Authorization'] = 'Bearer ' + token
    }
  }
});