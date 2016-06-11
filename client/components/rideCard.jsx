import React from "react";
import { Link } from "react-router";

import Timestamp from "./Timestamp";

const RideCard = ({ id, name, slug, start_date, end_date, chapter }) => (
  <div className="ride-card">
    <Link to={`/rides/${id}/${slug}`}>
        <header>
          <h2>{name}</h2>
          <h4><Timestamp value={start_date} format="D MMM" /> to <Timestamp value={end_date} format="D MMM YYYY" /></h4>
        </header>
    </Link>
  </div>
);

export default RideCard;