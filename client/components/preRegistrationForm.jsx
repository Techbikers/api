import _ from "lodash";
import React, { Component } from "react";
import Marty from "marty";
import { FormattedNumber } from "react-intl";
import forms, { Form, RenderForm } from 'newforms';

import FormField from "./formField.jsx";

const DetailsForm = Form.extend({
  biography: forms.CharField({
    label: "Tell us a bit about yourself",
    widget: forms.Textarea
  }),
  statement: forms.CharField({
    label: "Why do you want to do Techbikers?",
    widget: forms.Textarea
  }),
  ideas: forms.CharField({
    label: "How can you help out? Fundraising ideas? Organising community events?",
    widget: forms.Textarea
  })
});

class RideRegistrationForm extends Component {

  static propTypes = {
    ride: React.PropTypes.object.isRequired,
    currentRider: React.PropTypes.object.isRequired
  }

  constructor(options) {
    super(options);
    this.state = {
      form: new DetailsForm({onChange: this.onFormChange.bind(this)})
    }
  }

  onFormChange() {
    this.forceUpdate();
  }

  // Register the current user for the ride
  register(e) {
    e.preventDefault();
    let { ride, currentRider } = this.props;
    let form = this.state.form;
    if (form.validate()) {
      this.app.riderActions.updateRider(_.extend(currentRider, form.cleanedData));
      this.app.rideActions.registerRider(ride, {ideas: form.cleanedData.ideas});
    }
  }

  render() {
    let { ride, currentRider } = this.props;
    let fields = this.state.form.boundFieldsObj();

    return (
      <div className="ride-registration--form">
        <ol className="steps">
          <li className="active">
            <span>1</span>
            <span>Register Interest</span>
          </li>

          <li>
            <span>2</span>
            <span>Invites Sent</span>
          </li>

          <li>
            <span>3</span>
            <span>Confirm & Pay</span>
          </li>
        </ol>
        <div className="ride-registration--details">
          <h3>There is a <FormattedNumber style="currency" currency={ride.currency} value={ride.price} /> fee for this ride</h3>
          <p>
            We're thrilled you want to join the ride! Demand is high so pre-registration is required. Fill out the
            following form & we'll get back to you soon!</p>
        </div>
        <form className="payment-form">
          <FormField field={fields.biography} />
          <FormField field={fields.statement} />
          <FormField field={fields.ideas} />
          <div className="payment-form--submit">
            <button className="btn btn-blue" type="submit" onClick={this.register.bind(this)}>
              Register Interest!
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Marty.createContainer(RideRegistrationForm);