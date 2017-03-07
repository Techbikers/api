import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import DocumentTitle from "react-document-title";

import { getLeaderboard } from "techbikers/fundraisers/selectors";
import { getActiveFundraisers } from "techbikers/fundraisers/actions";
import { FundraiserShape } from "techbikers/fundraisers/shapes";

import Fundraiser from "techbikers/fundraisers/containers/Fundraiser";

const mapStateToProps = state => ({
  fundraisers: getLeaderboard(state)
});

const mapDispatchToProps = {
  getActiveFundraisers
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Leaderboard extends Component {
  static propTypes = {
    fundraisers: PropTypes.arrayOf(FundraiserShape),
    getActiveFundraisers: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.getActiveFundraisers();
  }

  render() {
    const { fundraisers } = this.props;

    return (
      <DocumentTitle title="Donate – Techbikers">
        <div className="content">
          <section id="leaderboard">
            <header>
              <h1>Donate to one of our many riders</h1>
            </header>

            <ul className="leaderboard">
              {fundraisers.map((fundraiser, position) => (
                <li key={fundraiser.id}>
                  <Fundraiser position={position + 1} {...fundraiser} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </DocumentTitle>
    );
  }
}
