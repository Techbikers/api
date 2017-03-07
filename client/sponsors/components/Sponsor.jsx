import React from "react";

import { SponsorShape } from "techbikers/sponsors/shapes";

const Sponsor = ({ sponsor }) => (
  <div className="media">
    <a href={sponsor.website} className="img" target="_blank">
      <img src={sponsor.logo} alt={sponsor.organization} />
    </a>
    <div className="bd">
      <h3><a href={sponsor.website} target="_blank">{sponsor.organization}</a></h3>
      <p>
        {sponsor.description}
        <br/>
        <a href={sponsor.facebook}>Facebook</a> | <a href={sponsor.twitter}>Twitter</a>
      </p>
    </div>
  </div>
);

Sponsor.propTypes = {
  sponsor: SponsorShape
};

export default Sponsor;
