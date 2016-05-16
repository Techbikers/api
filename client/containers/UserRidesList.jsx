import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import { getRidesForCurrentUser } from "../selectors/user";
import { getRidesByUser } from "../actions/ride";

import Spinner from "../components/Spinner";

const mapStateToProps = (state) => {
  return {
    rides: getRidesForCurrentUser(state)
  }
}

@connect(mapStateToProps)
export default class UserRidesList extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired
  };

  componentWillMount() {
    const { dispatch, userId } = this.props;
    dispatch(getRidesByUser(userId));
  }

  render() {
    const { rides } = this.props;

    if (!rides) {
      return <Spinner />;
    }

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