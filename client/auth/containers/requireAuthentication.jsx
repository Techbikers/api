import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { replace } from "react-router-redux";

import { getCurrentPathname } from "techbikers/app/selectors";

const wrapComponent = (WrappedComponent, overridePredicate) => {
  const mapStateToProps = (state, ownProps) => {
    const isAuthenticated = state.auth.state === "authenticated";
    const isOverridden = overridePredicate(state, ownProps);
    const pathname = getCurrentPathname(state);

    return { isAuthenticated, isOverridden, pathname };
  };

  const mapDispatchToProps = dispatch => ({
    redirectToLogin: returnTo => dispatch(replace({
      pathname: "/login",
      state: { modal: true, returnTo }
    }))
  });

  class AuthenticatedComponent extends Component {
    static propTypes = {
      redirectToLogin: PropTypes.func.isRequired,
      isAuthenticated: PropTypes.bool.isRequired,
      isOverridden: PropTypes.bool.isRequired,
      pathname: PropTypes.string.isRequired
    };

    componentWillMount() {
      this.checkAuth();
    }

    componentDidUpdate() {
      this.checkAuth();
    }

    checkAuth() {
      const { pathname, redirectToLogin } = this.props;

      if (!this.allowedAccess()) {
        redirectToLogin(pathname);
      }
    }

    allowedAccess() {
      const { isAuthenticated, isOverridden } = this.props;
      return isAuthenticated || isOverridden;
    }

    render() {
      const { isAuthenticated, isOverridden, ...props } = this.props; // eslint-disable-line no-unused-vars

      return this.allowedAccess() ? <WrappedComponent {...props}/> : null;
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent);
};

export default function requireAuthentication(overridePredicate = () => false) {
  return WrappedComponent => wrapComponent(WrappedComponent, overridePredicate);
}
