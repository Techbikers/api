import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { isEqual } from "lodash";

import { identifyUser } from "../actions/authentication";
import { setPageEntity } from "../actions/page";
import { getUserById } from "../actions/user";
import { getAuthenticatedUserId, getAuthenticatedUser } from "../selectors/user";

import App from "../components/App";

const mapStateToProps = (state) => {
  const { state: authState } = state.authentication;
  const isAuthenticated = authState === "authenticated";

  return {
    isAuthenticated,
    authenticatedUserId: getAuthenticatedUserId(state),
    authenticatedUser: getAuthenticatedUser(state)
  }
}

@connect(mapStateToProps)
export default class AppContainer extends Component {

  componentWillMount() {
    const { dispatch,
            params,
            isAuthenticated,
            authenticatedUserId,
            authenticatedUser } = this.props;

    // Set the entity id for this page based on the url parameters
    // (not every page will have an entity associated with it)
    dispatch(setPageEntity(params));

    // If the user is logged in but we haven't yet fetched the
    // entity for that user, then get the user entity.
    if (isAuthenticated && authenticatedUserId && !authenticatedUser) {
      dispatch(getUserById(authenticatedUserId)).then(
        response => {
          const user = response.response.entities.user[authenticatedUserId];
          dispatch(identifyUser(authenticatedUserId, user.email, user.first_name, user.last_name));
        }
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, params, location } = this.props;
    const { params: nextParams, location: nextLocation } = nextProps;

    // Set the page entity id from url params (if there is one)
    if (nextParams && params && !isEqual(nextParams, params)) {
      dispatch(setPageEntity(nextParams));
    }

    // next check if we're rendering a modal layer or not
    if (nextLocation.key !== location.key && nextLocation.state && nextLocation.state.modal) {
      // save the old children (just like animation)
      this.previousChildren = this.props.children
    }
  }

  render() {
    const { location, children, ...props } = this.props;
    const isModal = (location.state && location.state.modal && this.previousChildren);

    return <App {...props} children={isModal ? this.previousChildren : children} modalChildren={isModal ? children : null} />;
  }
}