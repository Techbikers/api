import _ from "lodash";
import React, { Component } from "react";
import Marty from "marty";

class AuthLogin extends Component {
  static propTypes = {
    backend: React.PropTypes.string,
    popup: React.PropTypes.object
  }

  static defaultProps = {
    className: "btn-blue",
    backend: "facebook",
    popup: {
      resizable: 1,
      scrollbars: 1,
      width: 580,
      height: 500
    }
  };

  componentDidMount() {
    // Set the authCallback so that we can call it from the popup window.
    window.authCallback = this.authCallback.bind(this);
    window.getJWT = this.getJWT.bind(this);
  }

  startAuth() {
    let options = this.props.popup;
    options.left = Math.round((screen.width / 2) - (options.width / 2)),
    options.top = (screen.height > options.height) ? Math.round((screen.height / 2) - (options.height / 2)) : 0

    // Convert options into an array
    let optionsArray = _.map(options, (value, key) => {
      return `${key}=${value || ''}`;
    });

    // Trigger callback
    let popup = window.open(`/auth/login/${this.props.backend}`, '_blank', optionsArray.join(','));

    if (popup && popup.focus)
      popup.focus();
  }

  getJWT() {
    return this.props.authToken;
  }

  authCallback(json) {
    if (json.token) {
      this.app.authActions.loginWithToken(json.token);

      if (this.props.onAuthSuccess)
        this.props.onAuthSuccess();
    }
  }

  render() {
    return (
      <button className={`btn ${this.props.className}`} type="submit" onClick={this.startAuth.bind(this)}>
        {this.props.buttonText || `Login with ${this.props.backend}`}
      </button>
    );
  }
}

AuthLogin = Marty.createContainer(AuthLogin, {
  listenTo: ['authStore'],
  fetch: {
    authToken() {
      return this.app.authStore.token;
    }
  }
});

export default AuthLogin;