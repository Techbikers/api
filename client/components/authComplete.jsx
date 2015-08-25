import _ from "lodash";
import React, { Component } from "react";

import Spinner from "./spinner.jsx";

class AuthComplete extends Component {
  componentDidMount() {
    this.responseHandler(window, window.opener || window.parent);
  }

  getParams(search) {
    let params = {};

    for (let param of search.replace(/^[\#\?]/, '').match(/([^=\/\&]+)=([^\&]+)/g)) {
      let splitParam = param.match(/([^=]+)=(.*)/);
      params[splitParam[1]] = decodeURIComponent(splitParam[2]);
    }

    return params;
  }

  responseHandler(window, parent) {
    const params = this.getParams(window.location.search),
          { backend } = this.props.params;

    // Take the  OAuth2/OAuth1 server response and submit to our token
    // exchange API which gets the access token, then user details and
    // ultimately returns an auth token we can log the user in with (or
    // an error with details).
    if (params && params.state && (params.code || params.oauth_token)) {
      fetch(`/api/auth/token-exchange`, {
        method: "post",
        credentials: "same-origin",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          backend: backend,
          code: params.code || params.oauth_token,
          state: params.state,
        })
      }).then(res => {
        // Send the reponse to the main window and close this window
        res.json().then(obj => {
          this.authCallback(parent, obj);
        });
      });
    }
  }

  authCallback(parent, obj) {
    parent.authCallback(obj);
    this.closeWindow(window);
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

export default AuthComplete;