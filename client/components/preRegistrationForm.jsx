import _ from "lodash";
import React, { Component } from "react";
import Marty from "marty";
import { FormattedNumber } from "react-intl";
import forms, { Form, RenderForm } from 'newforms';

import FormField from "./formField.jsx";
import Timestamp from "./timestamp.jsx";

const DetailsForm = Form.extend({
  statement: forms.CharField({
    label: "Why do you want to do Techbikers?",
    widget: forms.Textarea
  }),
  ideas: forms.CharField({
    label: "What's your best fundraising idea to reach your Techbikers funding goal?",
    widget: forms.Textarea
  }),
  ability: forms.ChoiceField({
    label: "What's your cycling level?",
    choices: [[1, 'Beginner'], [2, 'Confident'], [3, 'Intermediate'], [4, 'Advanced'], [5, 'Lycra Goddess/God']]
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
    let form = this.state.form;
    if (form.validate()) {
      this.app.rideActions.registerRider(this.props.ride, form.cleanedData);
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
          <p>
            We're thrilled you want to join this year's ride from Paris to London. To make sure we've
            got a great mix of people in the peloton, we've got a short application form below.</p>
          <p>
            Please bear in mind: If you're selected, you will have to pay a minimum contribution
            of <FormattedNumber style="currency" currency={ride.currency} value={ride.price} /> to the ride
            cost to secure your spot. You can of course contribute more so more money is left for Room to Read!</p>
        </div>
        <form className="payment-form">
          <FormField field={fields.statement} />
          <FormField field={fields.ideas} />
          <FormField field={fields.ability} />
          <div className="payment-form--submit">
            <button className="btn btn-blue" type="submit" onClick={this.register.bind(this)}>
              Apply for TechBikers <Timestamp value={ride.start_date} format="YYYY" />
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Marty.createContainer(RideRegistrationForm);