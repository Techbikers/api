import React, { PropTypes, Component } from "react";
import { autobind } from "core-decorators";
import { connect } from "react-redux";
import { Link } from "react-router";
import DocumentTitle from "react-document-title";

import { getRides } from "../actions/ride";
import { getUpcomingRides, getPastRides } from "../selectors/ride";

import RideCard from "../components/RideCard";
import Spinner from "../components/Spinner";

function mapStateToProps(state) {
  return {
    rides: {
      upcoming: getUpcomingRides(state),
      past: getPastRides(state)
    }
  }
}

@connect(mapStateToProps)
export default class Rides extends Component {
  static propTypes = {
    rides: PropTypes.shape({
      upcoming: PropTypes.array,
      past: PropTypes.array
    })
  };

  static defaultProps = {
    rides: []
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getRides());
  }

  render() {
    const { upcoming, past } = this.props.rides;

    return (
      <DocumentTitle title="Rides – Techbikers">
        <div className="content">
          <section id="rides">
            <header>
              <h1>Upcoming & Current Rides</h1>
            </header>

            <ul className="ride-list">
              {upcoming.map(ride => (
                <li key={ride.id}>
                  <RideCard {...ride} />
                </li>
              ))}
            </ul>

            <header>
              <h1>Past Rides</h1>
            </header>

            <ul className="ride-list">
              {past.map(ride => (
                <li key={ride.id}>
                  <RideCard {...ride} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </DocumentTitle>
    );
  }
}