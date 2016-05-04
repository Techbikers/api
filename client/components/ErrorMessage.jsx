import React, { Component } from "react";

export default class ErrorMessage extends Component {
  render() {
    const { error } = this.props;

    if (!error) {
      return null;
    }

    return (
      <div className="errors">
        <span className="errors--message">{error.message}</span>
        {this.errorDetails()}
      </div>
    );
  }

  errorDetails() {
    const { error } = this.props;

    if (!error.details) {
      return null;
    }

    return (
      <ul className="errors--details">
        {error.details.map((errors, field) => {
          return <li key={field}>{field}: {errors.map(error => { return error + " "; })}</li>
        })}
      </ul>
    );
  }
}
