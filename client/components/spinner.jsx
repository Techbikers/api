import React from "react";

const Spinner = ({message, noMargin = false}) => (
  <div className={"spinner" + (noMargin ? " no-margin" : "")}>
    <div className="spinner--loader">
      <div className="spinner--cube1"></div>
      <div className="spinner--cube2"></div>
    </div>
    <div className="spinner--message">
      {message}
    </div>
  </div>
);

export default Spinner;