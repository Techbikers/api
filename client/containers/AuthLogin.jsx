import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { autobind } from "core-decorators";

import { authenticateWithToken } from "../actions/authentication";
import { getAuthenticationToken } from "../selectors/user";

const mapStateToProps = state => {
  return {
    token: getAuthenticationToken(state)
  }
}

@connect(mapStateToProps)
export default class AuthLogin extends Component {
  static propTypes = {
    backend: PropTypes.string,
    popup: PropTypes.object
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
  startAuth() {
    let { popup, backend } = this.props;
    popup.left = Math.round((screen.width / 2) - (popup.width / 2)),
    popup.top = (screen.height > popup.height) ? Math.round((screen.height / 2) - (popup.height / 2)) : 0

    // Convert options into an array of strings
    let popupOptions = Object.keys(popup).map(option => {
      return `${option}=${popup[option] || ''}`;
    });

    // Trigger callback
    let popupWindow = window.open(`/auth/login/${backend}`, '_blank', popupOptions.join(','));

    if (popupWindow && popupWindow.focus)
      popupWindow.focus();
  }

  @autobind
  authCallback(response) {
    const { dispatch, onAuthSuccess } = this.props;

    // Even if the user is logged in, we'll swap out
    // the token so we have the latest info.
    dispatch(authenticateWithToken(response.token));

    if (typeof onAuthSuccess === "function") {
      onAuthSuccess();
    }
  }

  render() {
    const { className, buttonText, backend } = this.props;
    return (
      <button className={`btn ${className}`} type="submit" onClick={this.startAuth}>
        {buttonText || `Login with ${backend}`}
      </button>
    );
  }
}
