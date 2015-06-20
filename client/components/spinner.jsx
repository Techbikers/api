import React, { Component } from "react";

class Spinner extends Component {
  static defaultProps = {
    noMargin: false
  }

  render() {
    return (
      <div className={"spinner" + (this.props.noMargin ? " no-margin" : "")}>
        <div className="spinner--loader">
          <div className="spinner--cube1"></div>
          <div className="spinner--cube2"></div>
        </div>
        <div className="spinner--message">
          {this.props.message}
        </div>
      </div>
    );
  }
}

export default Spinner;