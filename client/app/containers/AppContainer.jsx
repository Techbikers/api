import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { locationShape } from "react-router";
import { isEqual } from "lodash";

import { identifyUser } from "techbikers/auth/actions";
import { setPageEntity } from "techbikers/app/actions";
import { getUserById } from "techbikers/users/actions";
import { getAuthenticatedUserId, getAuthenticatedUser } from "techbikers/auth/selectors";

import App from "techbikers/app/components/App";

const mapStateToProps = state => {
  const { state: authState } = state.auth;
  const isAuthenticated = authState === "authenticated";
  const pageMeta = state.page.meta || {};

  return {
    isAuthenticated,
    pageMeta,
    authenticatedUserId: getAuthenticatedUserId(state),
    authenticatedUser: getAuthenticatedUser(state)
  };
};

@connect(mapStateToProps)
export default class AppContainer extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: locationShape,
    isAuthenticated: PropTypes.bool,
    authenticatedUserId: PropTypes.number,
    authenticatedUser: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    params: PropTypes.shape({
      id: PropTypes.number,
      slug: PropTypes.string
    })
  };

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
      this.previousChildren = this.props.children;
    }
  }

  render() {
    const { location, children, ...props } = this.props;
    const isModal = (location.state && location.state.modal && this.previousChildren);

    return <App {...props} children={isModal ? this.previousChildren : children} modalChildren={isModal ? children : null} />;
  }
}
