import React, { PropTypes } from "react";

const Avatar = ({ name, avatar, size = 80 }) => (
  <div className="rider-avatar">
    <img title={name} src={`${avatar}?s=${size}`} width={size} height={size} />
  </div>
);

Avatar.propTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
  size: PropTypes.number
};

export default Avatar;
