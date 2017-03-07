import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import DocumentTitle from "react-document-title";

import { getUserById } from "techbikers/users/actions";
import { getAuthenticatedUser } from "techbikers/auth/selectors";
import { getCurrentUser, getRidesForCurrentUser } from "techbikers/users/selectors";
import { UserShape } from "techbikers/users/shapes";

import Avatar from "techbikers/users/components/Avatar";
import UserRidesList from "techbikers/users/containers/UserRidesList";
import TwitterLink from "techbikers/components/TwitterLink";
import Spinner from "techbikers/components/Spinner";

const mapStateToProps = state => ({
  user: getCurrentUser(state),
  rides: getRidesForCurrentUser(state),
  authenticatedUser: getAuthenticatedUser(state)
});

const mapDispatchToProps = {
  getUserById
};

@connect(mapStateToProps, mapDispatchToProps)
export default class RiderProfile extends Component {
  static propTypes = {
    canEdit: PropTypes.bool,
    params: PropTypes.shape({
      id: PropTypes.number.isRequired
    }),
    user: UserShape,
    getUserById: PropTypes.func.isRequired
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
    const { params } = this.props;
    this.props.getUserById(params.id);
  }

  render() {
    const { user, canEdit, params } = this.props;
    const { isEditing } = this.state;

    if (!user) {
      return <Spinner />;
    }

    return (
      <DocumentTitle title={`${user.name} – Techbikers`}>
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
                <a className="btn" href="edit">Edit Profile</a> : ""}
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

              {isEditing || user.statement !== "" ?
                <h2>Why am i doing Techbikers?</h2> : ""}

              <p>{user.statement}</p>
            </div>
          </section>

          <section id="rides">
            <div className="content centerText">
              <h2>`${user.first_name}'s rides:`</h2>
              <UserRidesList userId={params.id} />
            </div>
          </section>
        </div>
      </DocumentTitle>
    );
  }
}
