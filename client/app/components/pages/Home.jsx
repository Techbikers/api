import React from "react";
import DocumentTitle from "react-document-title";

import MailchimpForm from "techbikers/components/MailchimpForm";

const IndexPage = () => (
  <DocumentTitle title="Techbikers">
    <div>
      <div className="hero">
        <div className="content">
          <div className="row">

            <div className="strapline">
              <span className="strap1">Drop</span>
              <span className="strap2">your laptop <span className="strapAmp">&amp;</span> get on your</span>
              <span className="strap3">bike</span>
            </div>
          </div>
        </div>
      </div>

      <div id="main" className="content">

        <section id="mission">
          <header>
            <h1>Our Mission</h1>
          </header>

          <p>
            Techbikers is a collaboration of the London tech startup community to help children in need by supporting literacy charity Room to Read. Since 2012 over 300 tech professionals – including start-ups, venture capitalists and executives have cycled 960km in three Paris to London rides to raise money for this fantastic charity.
          </p>
        </section>

        <section>
          <header>
            <h1>Stats to Date</h1>
          </header>

          <div className="row">
            <div className="span6 stat">
              365
              <small>cyclists</small>
            </div>
          </div>

          <div className="row">
            <div className="span6 stat">
              £304,000
              <small>raised since 2012</small>
            </div>
          </div>

          <div className="row">
            <div className="span6 stat">
              1600km
              <small>ridden</small>
            </div>
          </div>
        </section>

        <MailchimpForm />
      </div>
    </div>
  </DocumentTitle>
);

export default IndexPage;
