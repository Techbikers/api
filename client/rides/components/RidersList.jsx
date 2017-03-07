import React, { PropTypes } from "react";

import { UserShape } from "techbikers/users/shapes";

import RiderCard from "techbikers/users/components/UserCard";

const RidersList = ({ riders }) => (
  <section id="riders">
    <div className="content">
      <h2>The Riders</h2>
      <ul>
        {riders.map(rider =>
          <RiderCard key={rider.id} {...rider} />
        )}
      </ul>
    </div>
  </section>
);

RidersList.propTypes = {
  riders: PropTypes.arrayOf(UserShape)
};

export default RidersList;
