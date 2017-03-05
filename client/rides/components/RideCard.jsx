import React, { PropTypes } from "react";
import { Link } from "react-router";

import Timestamp from "techbikers/components/Timestamp";

const RideCard = ({ id, name, slug, start_date, end_date }) => (
  <div className="ride-card">
    <Link to={`/rides/${id}/${slug}`}>
      <header>
        <h2>{name}</h2>
        <h4><Timestamp value={start_date} format="D MMM" /> to <Timestamp value={end_date} format="D MMM YYYY" /></h4>
      </header>
    </Link>
  </div>
);

RideCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  slug: PropTypes.string,
  start_date: PropTypes.string,
  end_date: PropTypes.string
};

export default RideCard;
