import React, { Component } from "react";
import Marty from "marty";
import _ from "lodash";
import { Link } from "react-router";
import DocumentTitle from "react-document-title";

import AuthStore from "../stores/authStore";
import RidesStore from "../stores/ridesStore";
import RidersStore from "../stores/ridersStore";

import AuthContainer from "./authContainer.jsx";

class Account extends Component {
  render() {
    const { rider } = this.props;
    return (
      <DocumentTitle title="My Account – Techbikers">
        <section>
          <div className="content text--centre">
            <header>
              <h1>Hi {rider.first_name}!</h1>
            </header>

            <ul className="list-unstyled">
              <li><Link className="btn" to="rider" params={rider}>View/Edit your Rider Profile</Link></li>
              <li>Change your password</li>
            </ul>

            {this.renderCurrentRides()}
            {this.renderPastRides()}

          </div>
        </section>
      </DocumentTitle>
    );
  }

  renderCurrentRides() {
    let { currentRides } = this.props;
    return (
      <div className="current-rides">
        <h2>Your upcoming rides:</h2>
        <ul className="list-unstyled">
          {!_.isEmpty(currentRides) ?
            _.map(currentRides, (ride) => {
              return <li key={ride.id}><Link to="ride" params={ride}>{ride.name}</Link></li>;
            })
            :
            <li>You haven't signed up for any rides yet</li>
          }
        </ul>
      </div>
    );
  }

  renderPastRides() {
    let { pastRides } = this.props;
    if (!_.isEmpty(pastRides)) {
      return (
        <div className="past-rides">
          <h2>Your past rides:</h2>
          <ul className="list-unstyled">
            {_.map(pastRides, (ride) => {
              return <li key={ride.id}><Link to="ride" params={ride}>{ride.name}</Link></li>;
            })}
          </ul>
        </div>
      );
    } else {
      return "";
    }
  }
}

Account = Marty.createContainer(Account, {
  listenTo: ['ridersStore', 'ridesStore', 'authStore'],
  fetch: {
    rider() {
      if (this.app.authStore.isLoggedIn()) {
        let riderId = this.app.authStore.user.user_id
        return this.app.ridersStore.getRider(riderId);
      } else {
        return null;
      }
    },
    currentRides() {
      // todo: actually get the proper rides
      return this.app.ridesStore.getCurrentRides();
    },
    pastRides() {
      // todo: actually get the proper rides
      return this.app.ridesStore.getPastRides();
    }
  }
});

export default AuthContainer(Account);