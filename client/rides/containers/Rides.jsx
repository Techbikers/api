import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import DocumentTitle from "react-document-title";

import { fetchAllRides } from "techbikers/rides/actions";
import { getUpcomingRides, getPastRides } from "techbikers/rides/selectors";
import { RideShape } from "techbikers/rides/shapes";

import RideCard from "techbikers/rides/components/RideCard";

const mapStateToProps = state => ({
  upcoming: getUpcomingRides(state),
  past: getPastRides(state)
});

const mapDispatchToProps = {
  fetchAllRides
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Rides extends Component {
  static propTypes = {
    upcoming: PropTypes.arrayOf(RideShape),
    past: PropTypes.arrayOf(RideShape),
    fetchAllRides: PropTypes.func.isRequired
  };

  static defaultProps = {
    upcoming: [],
    past: []
  };

  componentWillMount() {
    this.props.fetchAllRides();
  }

  render() {
    const { upcoming, past } = this.props;

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
