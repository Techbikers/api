import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { FormattedNumber } from "react-intl";

import { fetchUserById } from "techbikers/users/actions";
import { UserShape } from "techbikers/users/shapes";
import { FundraiserShape } from "techbikers/fundraisers/shapes";

import Avatar from "techbikers/users/components/Avatar";

const mapStateToProps = (state, ownProps) => {
  const { user } = ownProps;
  return {
    userObject: state.entities.user ? state.entities.user[user] : null
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  getUser: () => dispatch(fetchUserById(props.user))
});

@connect(mapStateToProps, mapDispatchToProps)
export default class Fundraiser extends Component {
  static propTypes = {
    fundraiser: FundraiserShape,
    position: PropTypes.number.isRequired,
    userObject: UserShape,
    currency: PropTypes.string,
    totalRaised: PropTypes.string,
    pageUrl: PropTypes.string,
    getUser: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { userObject } = this.props;

    if (!userObject) {
      this.props.getUser();
    }
  }

  render() {
    const { currency, totalRaised, pageUrl, position, userObject: user } = this.props;

    return (
      <div className="fundraiser">
        <span className={`fundraiser-position position-${position}`}>
          {position || ""}
        </span>

        <Avatar {...user} />

        <div className="fundraiser-details">
          <h3>{user ? user.name : "loading..."}</h3>
          <p>
            <FormattedNumber style="currency" currency={currency} value={totalRaised} /> <span>raised so far</span>
          </p>
        </div>

        <a href={pageUrl} className="btn btn-green fundraiser-sponsor-button">
          Sponsor now
        </a>

        {user &&
          <Link to={`/riders/${user.id}`} className="fundraiser-link" />}
      </div>
    );
  }
}
