import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { RideShape } from "techbikers/rides/shapes";
import { UserShape } from "techbikers/users/shapes";
import { getCurrentRide } from "techbikers/rides/selectors";
import { getUsersOnCurrentRide } from "techbikers/users/selectors";
import { fetchUsersByRide } from "techbikers/users/actions";

import Spinner from "techbikers/components/Spinner";
import RidersList from "techbikers/rides/components/RidersList";

const RidersWrapper = styled.section`
  border-top: 1px solid #e2e2e2;
  border-bottom: 1px solid #e2e2e2;
  background: #f5f5f5;
`;

const mapStateToProps = state => ({
  ride: getCurrentRide(state),
  riders: getUsersOnCurrentRide(state)
});

const mapDispatchToProps = {
  fetchUsersByRide
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ConnectedRidersList extends Component {
  static propTypes = {
    ride: RideShape,
    riders: PropTypes.arrayOf(UserShape),
    fetchUsersByRide: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.fetchUsersByRide(this.props.ride.id);
  }

  render() {
    const { riders } = this.props;

    return (
      <RidersWrapper>
        <div className="content">
          <h2>The Riders</h2>
          {riders.length === 0 ?
            <Spinner spacing="20px" />
            :
            <RidersList riders={riders} />
          }
        </div>
      </RidersWrapper>
    );
  }
}
