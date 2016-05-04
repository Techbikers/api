import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import DocumentTitle from "react-document-title";

import { getLeaderboard } from "../selectors/fundraiser";
import { getActiveFundraisers } from "../actions/fundraiser";

import Fundraiser from "../containers/Fundraiser";

const mapStateToProps = (state) => {
  return {
    fundraisers: getLeaderboard(state)
  }
}

@connect(mapStateToProps)
export default class Leaderboard extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getActiveFundraisers());
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
              {fundraisers.map((fundraiser, position) => {
                return (
                  <li key={fundraiser.id}>
                    <Fundraiser position={position+1} {...fundraiser} />
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </DocumentTitle>
    );
  }
}