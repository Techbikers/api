import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { autobind } from "core-decorators";
import DocumentTitle from "react-document-title";

import { getRides } from "../actions/ride";
import { getUserById } from "../actions/user";
import { getAuthenticatedUser, getCurrentUser, getRidesForCurrentUser } from "../selectors/user";

import Avatar from "../components/Avatar";
import TwitterLink from "../components/TwitterLink";
import Spinner from "../components/Spinner";
import UserRidesList from "./UserRidesList";

const mapStateToProps = (state) => {
  return {
    user: getCurrentUser(state),
    rides: getRidesForCurrentUser(state),
    authenticatedUser: getAuthenticatedUser(state)
  }
}

@connect(mapStateToProps)
export default class RiderProfile extends Component {
  static propTypes = {
    canEdit: PropTypes.bool
  };

  static defaultProps = {
    canEdit: false
  };

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false
    };
  }

  componentWillMount() {
    const { dispatch, params } = this.props;
    dispatch(getUserById(params.id));
  }

  render() {
    const { user, canEdit, params } = this.props;
    const { isEditing } = this.state;

    if (!user) {
      return <Spinner />;
    }

    return (
      <DocumentTitle title={user.name + " – Techbikers"}>
        <div id="rider-profile">
          {isEditing ?
            <section className="toolbar">
              <button className="btn" type="submit">Save Changes</button>
              <button className="btn">Cancel</button>
            </section> : ""}

          <section id="header">
            <header className="centerText">
              <Avatar {...user} size="130" rounded />
              <h1>{user.name}</h1>
              <h3>{user.company} |
                  {user.website} |
                  <TwitterLink handle={user.twitter} /></h3>
              {canEdit ?
                <a className="btn" href="edit">Edit Profile</a> : ''}
            </header>

            <div className="content text--centre">
              <p>
                <a className="btn" href={user.donation_page}>Sponsor {user.first_name}</a>
              </p>
            </div>
          </section>

          <section id="description">
            <div className="content centerText">
              <p>{user.biography}</p>

              {isEditing || user.statement !== '' ?
                <h2>Why am i doing Techbikers?</h2> : ''}

              <p>{user.statement}</p>
            </div>
          </section>

          <section id="rides">
            <div className="content centerText">
              <h2>{user.first_name}'s rides:</h2>
              <UserRidesList userId={params.id} />
            </div>
          </section>
        </div>
      </DocumentTitle>
    );
  }
}
