import React, { PropTypes, Component } from "react";
import { Link } from "react-router";
import Marty from "marty";
import _ from "lodash";
import DocumentTitle from "react-document-title";
import RideUtils from "../utils/rideUtils"

import RiderCard from "./riderCard.jsx";
import Timestamp from "./timestamp.jsx";
import RideRegistration from "./rideRegistration.jsx";

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

          <RideRegistration {...this.props} />

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