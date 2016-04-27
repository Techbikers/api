import React, { PropTypes, Component } from "react";
import DocumentTitle from "react-document-title";
import { Link } from "react-router";
import { FormattedNumber } from "react-intl";

import Avatar from "./Avatar";
import Spinner from "./Spinner";

export default class Fundraiser extends Component {
  static propTypes = {
    ride: PropTypes.object,
    user: PropTypes.object,
    fundraiser: PropTypes.object
  };

  render() {
    const { fundraiser, rider, ride, position } = this.props;

    return (
      <div className="fundraiser">
        <span className={`fundraiser-position position-${position}`}>
          {position || ""}
        </span>

        <Avatar {...rider} />

        <div className="fundraiser-details">
          <h3>{rider.name}</h3>
          <p>
            <FormattedNumber style="currency" currency={fundraiser.currency} value={fundraiser.totalRaised} /> <span>raised so far</span>
          </p>
        </div>

        <a href={fundraiser.pageUrl} className="btn btn-green fundraiser-sponsor-button">
          Sponsor now
        </a>

        <Link to="rider" params={{id: rider.id}} className="fundraiser-link" />
      </div>
    );
  }
}