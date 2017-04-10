import React, { Component } from "react";
import { connect } from "react-redux";

import { RideShape } from "techbikers/rides/shapes";

import RideCard from "techbikers/rides/components/RideCard";

const mapStateToProps = (state, props) => {
  const ride = state.entities.ride && state.entities.ride[props.rideId];
  return { ride };
};

@connect(mapStateToProps)
export default class ConnectedRideCard extends Component {
  static propTypes = {
    ride: RideShape
  };

  render() {
    const { ride } = this.props;

    if (!ride) {
      return null;
    }

    return <RideCard {...ride} />;
  }
}
