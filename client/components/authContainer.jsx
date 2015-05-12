import React, { Component } from "react";
import Marty from "marty";

export default (ComposedComponent) => {
  class AuthContainer extends Component {

    componentWillMount() {
      if (!this.app.authStore.isLoggedIn()) {
        let next = this.app.router.getCurrentPath();
        this.app.navigationActions.navigateTo('/login', {}, {next: next});
      }
    }

    render() {
      if (this.app.authStore.isLoggedIn()) {
        return (
          <ComposedComponent {...this.props} />
        );
      } else {
        return "";
      }
    }
  }

  return Marty.createContainer(AuthContainer);
};