import React, { Component, PropTypes } from "react";
import { autobind } from "core-decorators";

import { createFundraisingPage } from "techbikers/fundraisers/actions";

import AuthLogin from "techbikers/auth/containers/AuthLogin";

export default class SetupFundraising extends Component {
  static propTypes = {
    ride: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  @autobind
  createFundraiser() {
    const { dispatch, ride, user } = this.props;
    dispatch(createFundraisingPage(ride.id, user.id));
  }

  render() {
    const { fundraiser } = this.props;

    if (fundraiser) {
      return <a className="btn btn-blue" href={fundraiser.pageUrl}>Go to my fundraising page</a>;
    }

    return <AuthLogin backend="justgiving" buttonText="Create Fundraising Page" onAuthSuccess={this.createFundraiser} />;
  }
}
