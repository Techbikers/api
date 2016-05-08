import React, { Component, PropTypes } from "react";
import { FormattedNumber } from "react-intl";
import forms, { Form, RenderForm } from "newforms";
import { autobind } from "core-decorators";

import { registerUserForRide } from "../actions/ride";

import FormField from "./FormField";
import Timestamp from "./Timestamp";
import Spinner from "./Spinner";
import RegistrationSteps from "./RegistrationSteps";

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
    required: false,
    label: "What's your cycling level?",
    choices: [[1, 'Beginner'], [2, 'Confident'], [3, 'Intermediate'], [4, 'Advanced'], [5, 'Lycra Goddess/God']]
  })
});

export default class RideRegistrationForm extends Component {
  static propTypes = {
    ride: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      form: new DetailsForm({onChange: this.onFormChange})
    }
  }

  @autobind
  onFormChange() {
    this.forceUpdate();
  }

  @autobind
  register(e) {
    e.preventDefault();
    const { form } = this.state;
    const { dispatch, ride } = this.props;

    if (form.validate()) {
      dispatch(registerUserForRide(ride.id, form.cleanedData));
    }
  }

  render() {
    const { ride } = this.props;
    const fields = this.state.form.boundFieldsObj();

    return (
      <div className="ride-registration--form">
        <RegistrationSteps step={1} />
        <div className="ride-registration--details">
          <p>
            We're thrilled you want to join this year's ride from Paris to London. To make sure we've
            got a great mix of people in the peloton, we've got a short application form below.</p>
          <p>
            Please bear in mind: <b>If you're selected, you will have to pay a minimum contribution
            of <FormattedNumber style="currency" currency={ride.currency} value={ride.price} /></b> to the ride
            cost to secure your spot. You can of course contribute more so more money is left for Room to Read!</p>
        </div>
        <form>
          <div className="row centerText">
            <div className="span6">
              <FormField field={fields.statement} />
            </div>
            <div className="span6">
              <FormField field={fields.ideas} />
            </div>
            <div className="span6">
              <FormField field={fields.ability} />
            </div>
          </div>
          <div className="payment-form--submit">
            <button className="btn btn-blue" type="submit" onClick={this.register}>
              Apply for TechBikers <Timestamp value={ride.start_date} format="YYYY" />
            </button>
          </div>
        </form>
      </div>
    );
  }
}
