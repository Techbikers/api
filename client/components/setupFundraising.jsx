import React, { Component } from "react";
import forms, { Form, RenderForm } from 'newforms';

import { requireAuthentication } from "../containers/requireAuthentication";

import FormField from "./FormField";
import ProgressButton from "./ProgressButton";

@requireAuthentication
export default class SetupFundraising extends Component {

  constructor(props) {
    super(props);
    this.state = {
      created: false,
      loading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    // This is a hack
    // We want to detect when the fundraiser has been created and is passed to the already mounted
    // component. We don't care about the created state if we are mounting the component with a
    // fundraiser already present. The reason being we want to display the "Go to fundraising page"
    // button using the signOnUrl which expired 20 minutes after the fundraiser is created.
    if (this.state.loading && _.find(nextProps.currentRider.fundraisers, {'ride': this.props.ride.id})) {
      this.setState({
        loading: false,
        created: true
      });
    }
  }

  onFormChange() {
    this.forceUpdate();
  }

  createPage() {
    this.setState({loading: true}, () => {
      this.app.rideActions.createFundraisingPage(this.props.ride, this.props.currentRider)
    });
  }

  renderComplete() {
    let { ride, currentRider } = this.props,
        fundraiser = _.find(currentRider.fundraisers, {'ride': ride.id});

    // This is only shown straight after the fundraiser has been created.
    // Every other time the user loads the page this won't be show.
    return (
      <div className="ride-registration--content">
        <div className="ride-registration--details">
          <h3>All done! Now to start fundraising.</h3>
          <a style={{margin: "20px 0"}} className="btn btn-blue" href={fundraiser.signOnUrl} target="_blank">Go to fundraising page</a>
        </div>
      </div>
    );
  }

  renderForm() {
    return (
      <div className="ride-registration--content">
        <div className="ride-registration--details">
          <p>
            Time to setup a fundraising page. All donations are handled
            by <a href="https://home.justgiving.com" target="_blank">Just Giving</a> and
            will go directly to Room to Read.</p>
        </div>
        <div className="payment-form">
          <AuthLogin backend="justgiving" buttonText="Create Fundraising Page" onAuthSuccess={this.createPage.bind(this)} />
        </div>
      </div>
    );
  }

  render() {
    let { ride, currentRider } = this.props,
        fundraiser = currentRider && _.find(currentRider.fundraisers, {'ride': ride.id});

    if (currentRider && (this.state.created || !fundraiser)) {
      return (
        <section id="ride-registration">
          <div className="ride-registration--container ride-registration--popdown">
            <header className="header-btn">
              <a className="btn">Set up a Fundraising Page</a>
            </header>

            {!this.state.loading && !this.state.created &&
              this.renderForm()}

            {this.state.loading &&
              this.renderLoading()}

            {this.state.created &&
              this.renderComplete()}
          </div>
        </section>
      );
    } else {
      return null;
    }
  }
}
