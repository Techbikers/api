import React, { PropTypes } from "react";
import { Link } from "react-router";

import Timestamp from "techbikers/components/Timestamp";

const RideCard = ({ id, name, slug, startDate, endDate }) => (
  <div className="ride-card">
    <Link to={`/rides/${id}/${slug}`}>
      <header>
        <h2>{name}</h2>
        <h4><Timestamp value={startDate} format="D MMM" /> to <Timestamp value={endDate} format="D MMM YYYY" /></h4>
      </header>
    </Link>
  </div>
);

RideCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  slug: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string
};

export default RideCard;
