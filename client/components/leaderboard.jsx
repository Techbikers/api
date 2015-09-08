import _ from "lodash";
import React, { PropTypes, Component } from "react";
import Marty from "marty";
import DocumentTitle from "react-document-title";

import Fundraiser from "./fundraiser.jsx";
import Spinner from "./spinner.jsx";

class Leaderboard extends Component {
  render() {
    let fundraisers = _.sortByOrder(this.props.fundraisers, (fundraiser) => {
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
              {_.map(fundraisers, (fundraiser, position) => {
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

Leaderboard = Marty.createContainer(Leaderboard, {
  listenTo: ['fundraisersStore'],
  fetch: {
    fundraisers() {
      return this.app.fundraisersStore.getActiveFundraisers();
    }
  },
  pending() {
    return <Spinner message="fetching the fundraisers" />;
  }
});

export default Leaderboard;