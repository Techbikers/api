import React, { Component } from "react";
import { Link } from "react-router";
import Marty from "marty";
import _ from "lodash";
import DocumentTitle from "react-document-title";
import RideUtils from "../utils/rideUtils";
import Avatar from "./avatar.jsx"
import TwitterLink from "./twitterLink.jsx";

class RiderProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
  }

  static defaultProps = {
    'can_edit': false
  }

  render() {
    let { rider } = this.props;
    return (
      <DocumentTitle title={rider.name + " – Techbikers"}>
        <div id="rider-profile">
          {this.state.editing ?
            <section className="toolbar">
              <button className="btn" type="submit">Save Changes</button>
              <button className="btn">Cancel</button>
            </section> : ""}

          <section id="header">
            <header className="centerText">
              <Avatar rider={rider} size="130" rounded />
              <h1>{rider.name}</h1>
              <h3>{rider.company} |
                  {rider.website} |
                  <TwitterLink handle={rider.twitter} /></h3>
              {this.props.can_edit ?
                <a className="btn" href="edit">Edit Profile</a> : ''}
            </header>

            <div className="content text--centre">
              <p>
                <a className="btn" href={rider.donation_page}>Sponsor {rider.first_name}</a>
              </p>
            </div>
          </section>

          <section id="description">

            {this.renderSharedRides()}

            <div className="content centerText">
              <p>{rider.biography}</p>

              {this.state.editing || rider.statement !== '' ?
                <h2>Why am i doing Techbikers?</h2> : ''}

              <p>{rider.statement}</p>
            </div>
          </section>

          <section id="rides">
            <div className="content centerText">
              <h2>{rider.first_name}'s rides:</h2>
              {this.renderRides()}
            </div>
          </section>
        </div>
      </DocumentTitle>
    );
  }

  renderRides() {
    let { rides } = this.props;
    if (!_.isEmpty(rides)) {
      return (
        <ul className="list-unstyled">
          {_.map(rides, (ride) => {
            return <li key={ride.id}><Link to="ride" params={ride}>{ride.name}</Link></li>;
          })}
        </ul>
      );
    } else {
      return <span>This user has not signed up for any rides yet</span>;
    }
  }

  renderSharedRides() {
    // todo: send through the rider email if the current user is allowed to see it
    if (this.app.authStore.isLoggedIn()) {
      let sharedRides = RideUtils.riddenTogether(this.props.rider, this.props.currentRider);
      if (!_.isEmpty(sharedRides)) {
        return (
          <div className="content">
            <div className="callout">
              <h2>You've both been on (or are about to go on) a ride together!</h2>
              <p>
                Stay in touch with {this.props.rider.first_name} using the details below:<br/>
                email: <a href={"mailto:" + this.props.rider.email}>{this.props.rider.email}</a>
              </p>
            </div>
          </div>
        );
      }
    }
  }
}

RiderProfile = Marty.createContainer(RiderProfile, {
  listenTo: ['ridersStore', 'ridesStore', 'authStore'],
  fetch: {
    currentRider() {
      if (this.app.authStore.isLoggedIn()) {
        var user = this.app.authStore.user;
        return this.app.ridersStore.getRider(user.user_id);
      } else {
        return null;
      }
    },
    rider() {
      return this.app.ridersStore.getRider(this.props.params.id);
    },
    rides() {
      return this.app.ridesStore.getRidesForRider(this.props.params.id);
    }
  }
});

export default RiderProfile;