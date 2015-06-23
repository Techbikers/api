import _ from "lodash";
import React, { Component } from "react";

class Errors extends Component {
  render() {
    if (this.props.error) {
      return (
        <div className="errors">
          <span className="errors--message">{this.props.error.message}</span>
          <ul className="errors--details">
            {_.map(this.props.error.details, (errors, field) => {
              return (<li key={field}>{field}: {_.map(errors, (error) => { return error + " "; })}</li>);
            })}
          </ul>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Errors;