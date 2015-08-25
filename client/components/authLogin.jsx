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
  }

  componentDidMount() {
    // Set the authCallback so that we can call it from the popup window.
    window.authCallback = this.authCallback.bind(this);
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

  authCallback(res) {
    if (res.token)
      this.app.authActions.loginWithToken(res.token);
  }

  render() {
    return (
      <button className={`btn ${this.props.className}`} type="submit" onClick={this.startAuth.bind(this)}>
        {this.props.buttonText || `Login with ${this.props.backend}`}
      </button>
    );
  }
}

AuthLogin = Marty.createContainer(AuthLogin);

export default AuthLogin;