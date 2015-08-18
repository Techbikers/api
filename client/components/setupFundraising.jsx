import _ from "lodash";
import Marty from "marty";
import React, { Component } from "react";
import forms, { Form, RenderForm } from 'newforms';

import FormField from "./formField.jsx";
import ProgressButton from "./progressButton.jsx";
import Spinner from "./spinner.jsx";

const LoginForm = Form.extend({
  email: forms.EmailField({label: 'Just Giving Email Address'}),
  password: forms.CharField({label: 'Just Giving Password', widget: forms.PasswordInput}),
});

class SetupFundraising extends Component {

  constructor(props) {
    super(props);
    this.state = {
      created: false,
      loading: false,
      form: new LoginForm({onChange: this.onFormChange.bind(this)})
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

  createPage(e) {
    e.preventDefault();
    this.setState({loading: true});
    this.app.rideActions.createFundraisingPage(
      this.props.ride,
      this.props.currentRider,
      this.state.form.cleanedData.email,
      this.state.form.cleanedData.password)
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

  renderLoading() {
    return (
      <div className="ride-registration--content">
        <Spinner />
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
            will go directly to Room to Read. <b>Enter your Just Giving email and
            password</b> below and we'll handle the rest.</p>
          <p><small>
            Sorry to ask for your details. We don't think we should be either but
            hey, that's how Just Giving have setup their API. We promise we don't
            store these details or use them beyond creating this page for you.</small></p>
        </div>
        <form className="payment-form">
          <p>
            Don't have a Just Giving account? <a href="https://www.justgiving.com/signin?m=register" target="_blank">Create one</a></p>
          <div>
            {_.map(this.state.form.boundFieldsObj(), (field) => {
              return (
                <FormField key={field.htmlName} field={field} />
              );
            })}
          </div>
          <div className="payment-form--submit">
            <button className="btn btn-blue" type="submit" onClick={this.createPage.bind(this)}>Create Fundraising Page</button>
          </div>
        </form>
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

export default Marty.createContainer(SetupFundraising);