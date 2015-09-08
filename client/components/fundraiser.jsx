import _ from "lodash";
import React, { PropTypes, Component } from "react";
import Marty from "marty";
import DocumentTitle from "react-document-title";
import { Link } from "react-router";
import { FormattedNumber } from "react-intl";

import Avatar from "./avatar.jsx";
import Spinner from "./spinner.jsx";

class Fundraiser extends Component {
  static propTypes = {
    fundraiser: PropTypes.object.isRequired
  }

  render() {
    let { fundraiser, rider, ride, position } = this.props;
    return (
      <div className="fundraiser">
        <span className={`fundraiser-position position-${position}`}>
          {position || ""}
        </span>

        <Avatar rider={rider} />

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

Fundraiser = Marty.createContainer(Fundraiser, {
  listenTo: ['ridersStore', 'ridesStore'],
  fetch: {
    ride() {
      return this.app.ridesStore.getRide(this.props.fundraiser.ride);
    },
    rider() {
      return this.app.ridersStore.getRider(this.props.fundraiser.user);
    }
  },
  pending() {
    return <div style={{height: 100}}>Totting up the total</div>;
  }
});

export default Fundraiser;