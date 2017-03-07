import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import { logout } from "techbikers/auth/actions";
import { getCurrentPathname } from "techbikers/selectors/routing";

const mapStateToProps = state => {
  const { state: authState } = state.auth;
  const isAuthenticated = authState === "authenticated";
  const pathname = getCurrentPathname(state);

  return { isAuthenticated, pathname };
};

const mapDispatchToProps = {
  logout
};

@connect(mapStateToProps, mapDispatchToProps)
export default class AuthMenu extends Component {
  static propTypes = {
    pathname: PropTypes.string,
    isAuthenticated: PropTypes.bool,
    logout: PropTypes.func.isRequired
  };

  render() {
    const { isAuthenticated, pathname } = this.props;

    if (isAuthenticated) {
      return (
        <div className="span2">
          <a className="userAuth" onClick={() => this.props.logout()}>Log out</a>
          <Link to="account" className="userAuth">Account</Link>
        </div>
      );
    } else {
      return (
        <Link className="userAuth" to={{
          pathname: "/login",
          state: { modal: true, returnTo: pathname }
        }}>
          Login to Techbikers
        </Link>
      );
    }
  }
}
