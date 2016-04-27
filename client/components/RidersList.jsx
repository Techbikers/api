import React from "react";

import RiderCard from "./RiderCard";

const RidersList = ({riders}) => (
  <section id="riders">
    <div className="content">
      <h2>The Riders</h2>
      <ul>
        {riders.map(rider => {
          return <RiderCard key={rider.id} {...rider} />;
        })}
      </ul>
    </div>
  </section>
);

export default RidersList;