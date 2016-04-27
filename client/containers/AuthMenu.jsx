import React, { Component, PropTypes } from "react";
import { autobind } from "core-decorators";
import { connect } from "react-redux";
import { Link } from "react-router";

import { logout, openAuthModal } from "../actions/authentication";
import { getCurrentPathname } from "../selectors/routing";

const mapStateToProps = state => {
  const { state: authState } = state.authentication;
  const isAuthenticated = authState === "authenticated";
  const pathname = getCurrentPathname(state);

  return { isAuthenticated, pathname }
}

@connect(mapStateToProps)
export default class AuthMenu extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    dispatch: PropTypes.func.isRequired
  };

  @autobind
  handleLogout() {
    this.props.dispatch(logout())
  }

  @autobind
  openAuthModal(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(openAuthModal());
  }

  render() {
    const { isAuthenticated, pathname } = this.props;

    if (isAuthenticated) {
      return (
        <div className="span2">
          <a className="userAuth" onClick={this.handleLogout}>Log out</a>
          <Link to="account" className="userAuth">Account</Link>
        </div>
      );
    } else {
      return (
        <Link className="userAuth" to={{ pathname: "/login", state: { modal: true, returnTo: pathname }}}>Login to Techbikers</Link>
      );
    }
  }
}