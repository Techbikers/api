import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import DocumentTitle from "react-document-title";

import Fundraiser from "./Fundraiser";
import Spinner from "./Spinner";

const mapStateToProps = (state) => {
  return {
    fundraisers: []
  }
}

@connect(mapStateToProps)
export default class Leaderboard extends Component {
  render() {
    const fundraisers = _.sortByOrder(this.props.fundraisers, (fundraiser) => {
      return parseInt(fundraiser.totalRaised * 100);
    }, "desc");

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
                    <Fundraiser fundraiser={fundraiser} position={position+1} />
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