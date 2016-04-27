import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import { getRidesForCurrentUser } from "../selectors/user";

const mapStateToProps = (state) => {
  return {
    rides: getRidesForCurrentUser(state)
  }
}

@connect(mapStateToProps)
export default class UserRidesList extends Component {
  render() {
    const { rides } = this.props;

    if (rides.length === 0) {
      return <span>This user has not signed up for any rides yet</span>;
    }

    return (
      <ul className="list-unstyled">
        {rides.map(ride => {
          return <li key={ride.id}><Link to={`/rides/${ride.id}/${ride.slug}`}>{ride.name}</Link></li>;
        })}
      </ul>
    );
  }
}