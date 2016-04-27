import React from "react";
import { Link } from "react-router";

import Timestamp from "./Timestamp";

const RideCard = ({ ride }) => (
  <li className="ride-card">
    <Link to={`/rides/${ride.id}/${ride.slug}`}>
        <header>
          <h2>{ride.name}</h2>
          <h4><Timestamp value={ride.start_date} format="D MMM" /> to <Timestamp value={ride.end_date} format="D MMM YYYY" /></h4>
          <h4>Part of the {ride.chapter.name} chapter</h4>
        </header>
    </Link>
  </li>
);

export default RideCard;