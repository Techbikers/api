import React, { Component } from "react";
import { Link } from "react-router";

import Avatar from "./avatar.jsx";

class RiderCard extends Component {
  render() {
    const { rider } = this.props;
    return (
      <li className="rider">
        <Link to="rider" params={rider} >
          <Avatar {...this.props} />
          <div className="rider-name">
            <h4>{rider.name}</h4>
          </div>
        </Link>
      </li>
    );
  }
}

export default RiderCard;