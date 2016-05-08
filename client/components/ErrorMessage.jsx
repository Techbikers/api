import React, { Component } from "react";

export default class ErrorMessage extends Component {
  render() {
    const { errors } = this.props;

    if (!errors) {
      return null;
    }

    return (
      <div className="errors">
        {errors.message &&
          <span className="errors--message">{errors.message}</span>}

        {errors.detail &&
          <span className="errors--message">{errors.detail}</span>}

        {errors.non_field_errors &&
          <span className="errors--message">
            {errors.non_field_errors.map(error => <span>{error}</span>)}
          </span>}

        {this.fieldErrors()}
      </div>
    );
  }

  fieldErrors() {
    let { errors } = this.props;

    delete errors.detail;
    delete errors.non_field_errors;

    if (!errors || errors.message) {
      return null;
    }

    return (
      <ul className="errors--details">
        {Object.keys(errors).map(field => {
          return <li key={field}>{field}: {errors[field].join(" ")}</li>
        })}
      </ul>
    );
  }
}
