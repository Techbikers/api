import _ from "lodash";
import React, { Component } from "react";
import Marty from "marty";
import DocumentTitle from "react-document-title";

class Sponsors extends Component {
  filterSponsorsByLevel(level) {
    return _.filter(this.props.sponsors, (sponsor) => {
      return _.filter(sponsor.rides, {"sponsor_level": level}).length > 0;
    });
  }

  renderSponsor(sponsor) {
    return (
      <li className="media">
        <a href={sponsor.website} className="img" target="_blank">
          <img src={sponsor.logo} alt={sponsor.organization} />
        </a>
        <div className="bd">
          <h3><a href={sponsor.website} target="_blank">{sponsor.organization}</a></h3>
          <p>
            {sponsor.description}
            <br/>
            <a href={sponsor.facebook}>Facebook</a> | <a href={sponsor.twitter}>Twitter</a>
          </p>
        </div>
      </li>
    );
  }

  render() {
    console.log(this.filterSponsorsByLevel("gold"));
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
                {_.map(this.filterSponsorsByLevel("gold"), (sponsor) => {
                  return this.renderSponsor(sponsor);
                })}
              </ul>

              <h2>Silver Sponsors</h2>
              <ul className="list--secret">
                {_.map(this.filterSponsorsByLevel("silver"), (sponsor) => {
                  return this.renderSponsor(sponsor);
                })}
              </ul>

              <h2 id="inkind">Sponsors in kind</h2>
              <p>
                The following sponsors have donated their products, time and energy to help TechBikers
                reach their goal, we are very thankful for their support</p>
              <ul className="list--secret list--inline inkind">
                {_.map(this.filterSponsorsByLevel("silver"), (sponsor) => {
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

Sponsors = Marty.createContainer(Sponsors, {
  listenTo: ['sponsorsStore'],
  fetch: {
    sponsors() {
      return this.app.sponsorsStore.getAll();
    }
  }
});

export default Sponsors;