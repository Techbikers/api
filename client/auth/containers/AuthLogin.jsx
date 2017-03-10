import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { autobind } from "core-decorators";

import { authenticationCallback } from "techbikers/auth/actions";
import { getAuthToken } from "techbikers/auth/selectors";

const mapStateToProps = state => ({
  token: getAuthToken(state)
});

const mapDispatchToProps = {
  authenticationCallback
};

@connect(mapStateToProps, mapDispatchToProps)
export default class AuthLogin extends Component {
  static propTypes = {
    backend: PropTypes.string,
    className: PropTypes.string,
    buttonText: PropTypes.string,
    popup: PropTypes.shape({
      resizable: PropTypes.number,
      scrollbars: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number
    }),
    authenticationCallback: PropTypes.func.isRequired,
    onAuthSuccess: PropTypes.func.isRequired
  };

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
    window.authCallback = this.authCallback;
  }

  @autobind
  handleAuth() {
    const { popup, backend } = this.props;
    popup.left = Math.round((screen.width / 2) - (popup.width / 2));
    popup.top = (screen.height > popup.height) ? Math.round((screen.height / 2) - (popup.height / 2)) : 0;

    // Convert options into an array of strings
    const popupOptions = Object.keys(popup).map(option => `${option}=${popup[option] || ""}`);

    // Trigger callback
    const popupWindow = window.open(`/auth/login/${backend}`, "_blank", popupOptions.join(","));

    if (popupWindow && popupWindow.focus) {
      popupWindow.focus();
    }
  }

  @autobind
  authCallback(response) {
    const { onAuthSuccess } = this.props;

    // Even if the user is logged in, we'll swap out
    // the token so we have the latest info.
    this.props.authenticationCallback(response.token);

    if (typeof onAuthSuccess === "function") {
      onAuthSuccess();
    }
  }

  render() {
    const { className, buttonText, backend } = this.props;
    return (
      <button className={`btn ${className}`} type="submit" onClick={() => this.handleAuth()}>
        {buttonText || `Login with ${backend}`}
      </button>
    );
  }
}
