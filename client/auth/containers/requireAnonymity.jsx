import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { replace } from "react-router-redux";
import { locationShape } from "react-router";

import { getLocation } from "techbikers/app/selectors";

const wrapComponent = WrappedComponent => {
  const mapStateToProps = state => ({
    location: getLocation(state),
    isAuthenticated: state.auth.state === "authenticated"
  });

  const mapDispatchToProps = {
    replace
  };

  class AnonymousComponent extends Component {
    static propTypes = {
      replace: PropTypes.func.isRequired,
      isAuthenticated: PropTypes.bool.isRequired,
      location: locationShape
    };

    componentWillMount() {
      this.checkAuth();
    }

    componentDidUpdate() {
      this.checkAuth();
    }

    checkAuth() {
      const { isAuthenticated, location } = this.props;

      if (isAuthenticated) {
        this.props.replace(location.state && location.state.returnTo || "/");
      }
    }

    render() {
      return <WrappedComponent {...this.props}/>;
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(AnonymousComponent);
};

export default function requireAnonymity() {
  return WrappedComponent => wrapComponent(WrappedComponent);
}
