import React from "react";

const MetaTags = props => (
  <div>
    {Object.keys(props).map(key =>
      <meta key={key} property={key} content={props[key]} />
    )}
  </div>
);

export default MetaTags;
