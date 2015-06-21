import _ from "lodash";
import React, { PropTypes, Component } from "react";
import Marty from "marty";
import DocumentTitle from "react-document-title";
import RideCard from "./rideCard.jsx";
import Spinner from "./spinner.jsx";

class Rides extends Component {
  render() {
    let { currentRides, pastRides } = this.props;
    return (
      <DocumentTitle title="Rides – Techbikers">
        <div className="content">
          <section id="rides">
            <header>
              <h1>Current Rides</h1>
            </header>

            <ul className="ride-list">
              {_.map(currentRides, (ride) => {
                return <RideCard key={ride.id} ride={ride} />;
              })}
            </ul>
          </section>

          <section id="rides">
            <header>
              <h1>Past Rides</h1>
            </header>

            <ul className="ride-list">
              {_.map(pastRides, (ride) => {
                return <RideCard key={ride.id} ride={ride} />;
              })}
            </ul>
          </section>
        </div>
      </DocumentTitle>
    );
  }
}

Rides = Marty.createContainer(Rides, {
  listenTo: ['ridesStore'],
  fetch: {
    currentRides() {
      return this.app.ridesStore.getCurrentRides();
    },
    pastRides() {
      return this.app.ridesStore.getPastRides();
    }
  },
  pending() {
    return <Spinner message="tracking down rides" />;
  }
});

export default Rides;