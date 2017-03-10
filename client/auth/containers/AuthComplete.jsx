import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { locationShape } from "react-router";

import { exchangeToken } from "techbikers/auth/actions";
import { getAuthToken } from "techbikers/auth/selectors";

import Spinner from "techbikers/components/Spinner";

const mapStateToProps = state => ({
  token: getAuthToken(state),
  oAuthResponse: state.oAuth
});

const mapDispatchToProps = {
  exchangeToken
};

@connect(mapStateToProps, mapDispatchToProps)
export default class AuthComplete extends Component {
  static propTypes = {
    location: locationShape,
    params: PropTypes.shape({
      backend: PropTypes.string.isRequired
    }).isRequired,
    exchangeToken: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.parent = window.opener || window.parent;
  }

  componentDidMount() {
    const { query } = this.props.location;
    const { backend } = this.props.params;

    // Take the  OAuth2/OAuth1 server response and submit to our token
    // exchange API which gets the access token, then user details and
    // ultimately returns an auth token we can log the user in with (or
    // an error with details).
    if (query && query.state && (query.code || query.oauth_token)) {
      this.props.exchangeToken(backend, query.code || query.oauth_token, query.state);
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
    } catch (e) {
      // IOS bug wont let us close a popup if still loading
      window.addEventListener("load", () => {
        window.close();
      });
    }
    return null;
  }

  render() {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
}
