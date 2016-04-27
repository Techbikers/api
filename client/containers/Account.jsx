import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import DocumentTitle from "react-document-title";

import { getAuthenticatedUser, getAuthenticatedUserId } from "../selectors/user";
import { getUserById } from "../actions/user";
import { setPageEntity } from "../actions/page";

import requireAuthentication from "./requireAuthentication";
import UserRidesList from "./UserRidesList";
import Spinner from "../components/Spinner";

const mapStateToProps = (state) => {
  return {
    id: getAuthenticatedUserId(state),
    user: getAuthenticatedUser(state)
  }
}

@requireAuthentication()
@connect(mapStateToProps)
export default class Account extends Component {
  componentWillMount() {
    const { id, dispatch } = this.props;
    dispatch(getUserById(id));
    dispatch(setPageEntity({id}));
  }

  render() {
    const { user } = this.props;

    if (!user) {
      return <Spinner />
    }

    return (
      <DocumentTitle title="My Account – Techbikers">
        <section>
          <div className="content text--centre">
            <header>
              <h1>Hi {user.first_name}!</h1>
            </header>

            <ul className="list-unstyled">
              <li><Link className="btn" to={`/riders/${user.id}`}>View/Edit your Rider Profile</Link></li>
              <li>Change your password</li>
            </ul>

            <div className="current-rides">
              <h2>Your upcoming rides:</h2>
              <UserRidesList />
            </div>

          </div>
        </section>
      </DocumentTitle>
    );
  }
}