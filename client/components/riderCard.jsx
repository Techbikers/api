import React from "react";
import { Link } from "react-router";

import Avatar from "./Avatar";

const RiderCard = ({id, name, avatar, size = 60}) => (
  <li className="rider">
    <Link to={`/riders/${id}`}>
      <Avatar name={name} avatar={avatar} size={size} />
      <div className="rider-name">
        <h4>{name}</h4>
      </div>
    </Link>
  </li>
);

export default RiderCard;