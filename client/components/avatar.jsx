import React from "react";

const Avatar = ({name, avatar, size = 80}) => (
  <div className="rider-avatar">
    <img title={name} src={avatar + "?s=" + size} />
  </div>
);

export default Avatar;