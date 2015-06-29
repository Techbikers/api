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

Marty.HttpStateSource.addHook({
  id: 'addCSRFToken',

  before(req) {

    function getCookie(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i];
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) == (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }

    let csrftoken = getCookie('csrftoken');
    if (!this.app.authStore.isLoggedIn() && csrftoken) {
      req.headers['X-CSRFToken'] = csrftoken;
    }
  }
});