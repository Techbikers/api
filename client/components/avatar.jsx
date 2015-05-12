import React, { Component } from "react";
import { Link } from "react-router";

class Avatar extends Component {

  static defaultProps = {
    size: 80
  }

  render() {
    const { rider } = this.props;
    return (
      <div className="rider-avatar">
        <img title={rider.name} src={rider.avatar + "?s=" + this.props.size} />
      </div>
    );
  }
}

export default Avatar;