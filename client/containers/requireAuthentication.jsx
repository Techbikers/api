import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { replace } from "react-router-redux";

import { getCurrentPathname } from "../selectors/routing";

const wrapComponent = (WrappedComponent, overridePredicate) => {
  const mapStateToProps = (state, ownProps) => {
    const isAuthenticated = state.authentication.state === "authenticated";
    const isOverridden = overridePredicate(state, ownProps);
    const pathname = getCurrentPathname(state);

    return { isAuthenticated, isOverridden, pathname }
  }

  class AuthenticatedComponent extends Component {
    static propTypes = {
      dispatch: PropTypes.func.isRequired,
      isAuthenticated: PropTypes.bool.isRequired,
      isOverridden: PropTypes.bool.isRequired
    };

    componentWillMount() {
      this.checkAuth();
    }

    componentDidUpdate() {
      this.checkAuth();
    }

    checkAuth() {
      const { dispatch, pathname } = this.props;

      if (!this.allowedAccess()) {
        dispatch(replace({ pathname: "/login", state: {modal: true, returnTo: pathname}}));
      }
    }

    allowedAccess() {
      const { isAuthenticated, isOverridden } = this.props;

      return isAuthenticated || isOverridden
    }

    render() {
      const { isAuthenticated, isOverridden, ...props } = this.props;

      return this.allowedAccess() ? <WrappedComponent {...props}/> : null
    }
  }

  return connect(mapStateToProps)(AuthenticatedComponent)
}

export default function requireAuthentication(overridePredicate = () => false) {
  return (WrappedComponent) => {
    return wrapComponent(WrappedComponent, overridePredicate)
  }
}
