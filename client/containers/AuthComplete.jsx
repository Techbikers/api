import React, { Component } from "react";
import { connect } from "react-redux";

import { exchangeAuthenticationToken } from "../actions/authentication";
import { getAuthenticationToken } from "../selectors/user";

import Spinner from "../components/Spinner";

const mapStateToProps = state => {
  return {
    token: getAuthenticationToken(state),
    oAuthResponse: state.oAuth
  };
}

@connect(mapStateToProps)
export default class AuthComplete extends Component {
  constructor(props) {
    super(props);
    this.parent = window.opener || window.parent;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { query } = this.props.location;
    const { backend } = this.props.params;

    // Take the  OAuth2/OAuth1 server response and submit to our token
    // exchange API which gets the access token, then user details and
    // ultimately returns an auth token we can log the user in with (or
    // an error with details).
    if (query && query.state && (query.code || query.oauth_token)) {
      dispatch(exchangeAuthenticationToken(backend, query.code || query.oauth_token, query.state));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { oAuthResponse } = nextProps;

    if (oAuthResponse) {
      this.parent.authCallback(oAuthResponse);
      this.closeWindow(window);
    }
  }

  closeWindow(window) {
    // Close this current window
    try {
      window.close();
    }
    catch (e) {}

    // IOS bug wont let us close a popup if still loading
    window.addEventListener("load", () => {
      window.close();
    });
  }

  render() {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
}
