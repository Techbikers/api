import React from "react";
import { Link } from "react-router";

import Timestamp from "./timestamp.jsx";

class RideCard extends React.Component {
  render() {
    const { ride } = this.props;

    return (
      <li className="ride-card">
        <Link to="ride" params={ride}>
            <header>
                <h2>{ride.name}</h2>
                <h4><Timestamp value={ride.start_date} format="D MMM" /> to <Timestamp value={ride.end_date} format="D MMM YYYY" /></h4>
                <h4>Part of the {ride.chapter.name} chapter</h4>
            </header>
        </Link>
      </li>
    );
  }
}

export default RideCard;