import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import DocumentTitle from "react-document-title";

import { getSponsors } from "../actions/sponsor";
import { getActiveSponsors } from "../selectors/sponsor";
import Sponsor from "../components/Sponsor";

const mapStateToProps = state => {
  return { gold: getActiveSponsors(state) }
}

@connect(mapStateToProps)
export default class SponsorsPage extends Component {
  static propTypes = {
    gold: PropTypes.arrayOf(PropTypes.object),
    silver: PropTypes.arrayOf(PropTypes.object),
    inkind: PropTypes.arrayOf(PropTypes.object)
  };

  static defaultProps = {
    gold: [],
    silver: [],
    inkind: []
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getSponsors());
  }

  render() {
    const { gold, silver, inkind } = this.props;

    return (
      <DocumentTitle title="Sponsors – Techbikers">
        <div className="content">
          <section>
            <header>
              <h1>Our sponsors</h1>
            </header>

            <div className="content">
              <p>
                We are honoured to have the following companies as our sponsors. Along with the effort
                of our riders they make each Techbikers ride possible. We are incredibly grateful for
                their support, which means that all donations go directly to Room to Read.</p>

              <h2>Gold Sponsors</h2>
              <ul className="list--secret">
                {gold.map(sponsor => {
                  return <Sponsor key={sponsor.id} sponsor={sponsor} />;
                })}
              </ul>

              <h2>Silver Sponsors</h2>
              <ul className="list--secret">
                {silver.map(sponsor => {
                  return <Sponsor key={sponsor.id} sponsor={sponsor} />;
                })}
              </ul>

              <h2 id="inkind">Sponsors in kind</h2>
              <p>
                The following sponsors have donated their products, time, and energy to help TechBikers
                reach their goal. We are very thankful for their support, and you should check them out.</p>
              <ul className="list--secret list--inline inkind">
                {inkind.map(sponsor => {
                  return (
                    <li>
                      <a href={sponsor.website} className="img" target="_blank">
                        <img width="205" height="154" src={sponsor.logo} alt={sponsor.organization} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>
      </DocumentTitle>
    );
  }
}
