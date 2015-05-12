import React, { PropTypes, Component } from "react";
import { Link } from "react-router";
import Marty from "marty";
import _ from "lodash";
import DocumentTitle from "react-document-title";
import RideUtils from "../utils/rideUtils"

import RiderCard from "./riderCard.jsx";
import Timestamp from "./timestamp.jsx";

class Ride extends Component {

  render() {
    const { ride, riders } = this.props;
    return (
      <DocumentTitle title={ride.name + " - Techbikers"}>
        <div id="ride">
          <section id="header">
            <header>
              <h1>{ride.name}</h1>
              <h3>
                <Timestamp value={ride.start_date} format="D MMM" /> to <Timestamp value={ride.end_date} format="D MMM YYYY" />
              </h3>
              <h3>Part of the <Link to="chapter" params={{name: ride.chapter.name.toLowerCase()}} >{ride.chapter.name}</Link> chapter</h3>
            </header>
          </section>

          {this.renderRegistration()}

          <section id="riders">
            <div className="content">
              <h2>The Riders</h2>

              <ul>
                {_.map(riders, (rider) => {
                  return <RiderCard key={rider.id} rider={rider} size="60" />;
                })}
              </ul>
            </div>
          </section>

          <section id="description">
            <div className="content" dangerouslySetInnerHTML={{__html: ride.description_html}}>
            </div>
          </section>
        </div>
      </DocumentTitle>
    );
  }

  renderRegistration() {
    let { ride } = this.props;
    if (!ride.is_over) {
      return (
        <section id="registration">
          <div className="content">
            {this.props.auth.loggedIn && RideUtils.signedUp(this.props.currentRider, ride) ?
              <div className="callout">
                <h2>Good job {this.props.currentRider.first_name}! You're signed up for this ride!</h2>
              </div>
            : ride.spaces_left < 1 ?
              <div className="callout">
                <h2>Registration for this ride is FULL</h2>
                <p>Thanks for your interest but this year's ride is fully booked.</p>
              </div>
            :
              <div className="callout">
                <h2>Register for the {ride.name} ride!</h2>
                <p>There is a {ride.currency} {ride.price} fee for this ride.</p>
                <h2>
                  <a className="btn" href="">Register Now</a>
                </h2>
              </div>
            }
          </div>
        </section>
      );
    } else {
      return "";
    }
  }
}

Ride = Marty.createContainer(Ride, {
  listenTo: ['ridesStore', 'ridersStore', 'authStore'],
  fetch: {
    ride() {
      return this.app.ridesStore.getRide(this.props.params.id);
    },
    riders() {
      return this.app.ridersStore.getRidersForRide(this.props.params.id);
    },
    currentRider() {
      if (this.app.authStore.isLoggedIn()) {
        var user = this.app.authStore.user;
        return this.app.ridersStore.getRider(user.user_id);
      } else {
        return null;
      }
    }
  }
});

export default Ride;