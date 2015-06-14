import _ from "lodash";
import React, { Component } from "react";
import forms, { Form, RenderForm } from 'newforms';

import FormField from "./formField.jsx";

const PaymentDetailsForm = Form.extend({
  number: forms.CharField({
    initial: "",
    label: "XXXX XXXX XXXX XXXX",
    maxLength: 16
  }),
  cvc: forms.CharField({
    label: "CVC",
    maxLength: 3
  }),
  exp_month: forms.CharField({
    label: "MM",
    maxLength: 2
  }),
  exp_year: forms.CharField({
    label: "YYYY",
    maxLength: 4
  }),
  name: forms.CharField({
    label: "Name on card"
  }),
  terms: forms.BooleanField({
    label: 'I have read and agree to the Terms and Conditions'
  })
});

class PaymentForm extends Component {
  static propTypes = {
    onSubmit: React.PropTypes.func.isRequired,
  }

  static defaultProps = {
    submitText: "Submit"
  }

  constructor(options) {
    super(options);
    this.state = {
      form: new PaymentDetailsForm({onChange: this.onFormChange.bind(this)})
    }
  }

  onFormChange() {
    this.forceUpdate();
  }

  onFormSubmit(e) {
    e.preventDefault();
    let form = this.state.form;
    if (form.validate()) {
      this.props.onSubmit(form.cleanedData)
    }
  }

  render() {
    let fields = this.state.form.boundFieldsObj();
    let cardType = Stripe.card.cardType(this.state.form.data.number).toLowerCase().replace(" ", "-");
    return (
      <form className="payment-form">
        <div className="payment-form--credit-card">
          <div className="row">
            <div className="longNumber">
              <FormField field={fields.number} />
              <span className={"card-type " + cardType}></span>
            </div>
            <FormField className="cvc" field={fields.cvc} />
          </div>

          <div className="row">
            <FormField className="nameOnCard" field={fields.name} />

            <div className="date">
              <FormField className="month" field={fields.exp_month} />
              <FormField className="year" field={fields.exp_year} />
            </div>
          </div>
        </div>

        <div className="payment-form--submit">
          <button className="btn btn-blue" type="submit" onClick={this.onFormSubmit.bind(this)}>
            {this.props.submitText}
          </button>
        </div>
      </form>
    );
  }
}

export default PaymentForm;