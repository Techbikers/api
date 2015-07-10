import _ from "lodash";
import React, { Component } from "react";
import forms, { Form, RenderForm, TextInput } from 'newforms';
import PaymentUtils from "../utils/paymentUtils";

import FormField from "./formField.jsx";

class PaymentForm extends Component {
  static propTypes = {
    onSubmit: React.PropTypes.func.isRequired,
    customAmount: React.PropTypes.boolean
  }

  static defaultProps = {
    submitText: "Submit",
    customAmount: true,
    minAmount: 0
  }

  constructor(options) {
    super(options);
    this.state = {
      form: this.paymentDetailsForm()
    }
  }

  paymentDetailsForm() {
    const PaymentDetailsForm = Form.extend({
      amount: forms.DecimalField({
        label: this.props.minAmount,
        required: this.props.customAmount,
        initial: this.props.minAmount,
        minValue: this.props.minAmount,
        maxDecimalPlaces: 2
      }),
      number: forms.CharField({
        initial: "",
        label: "•••• •••• •••• ••••",
        widgetAttrs: {
          onKeyPress: (event) => {
            PaymentUtils.restrictNumeric(event);
            PaymentUtils.restrictCardNumber(event);
            PaymentUtils.formatCardNumber(event);
          },
          onKeyDown: (event) => {
            PaymentUtils.formatBackCardNumber(event);
          },
          onChange: (event) => {
            PaymentUtils.reFormatCardNumber(event);
          },
          onPaste: (event) => {
            PaymentUtils.reFormatCardNumber(event);
          },
          onInput: (event) => {
            PaymentUtils.reFormatCardNumber(event);
          }
        }
      }),
      cvc: forms.CharField({
        label: "•••",
        maxLength: 4,
        widgetAttrs: {
          onKeyPress: (event) => {
            PaymentUtils.restrictNumeric(event);
            PaymentUtils.restrictCVC(event);
          },
          onPaste: (event) => {
            PaymentUtils.reFormatCVC(event);
          },
          onChange: (event) => {
            PaymentUtils.reFormatCVC(event);
          },
          onInput: (event) => {
            PaymentUtils.reFormatCVC(event);
          }
        }
      }),
      exp: forms.CharField({
        label: "MM / YY",
        widgetAttrs: {
          onKeypress: (event) => {
            PaymentUtils.restrictNumeric(event);
            PaymentUtils.restrictExpiry(event);
            PaymentUtils.formatExpiry(event);
            PaymentUtils.formatForwardSlashAndSpace(event);
            PaymentUtils.formatForwardExpiry(event);
          },
          onKeyDown: (event) => {
            PaymentUtils.formatBackExpiry(event);
          },
          onChange: (event) => {
            PaymentUtils.reFormatExpiry(event);
          },
          onInput: (event) => {
            PaymentUtils.reFormatExpiry(event);
          }
        }
      }),
      name: forms.CharField({
        label: "Name on card"
      }),
      clean() {
        if (this.cleanedData.exp) {
          let exp = PaymentUtils.getCardExpiryVal(this.cleanedData.exp);
          this.cleanedData["exp_month"] = exp.month;
          this.cleanedData["exp_year"] = exp.year;
        }
      }
    });
    return new PaymentDetailsForm({onChange: this.onFormChange.bind(this)});
  }

  onFormChange() {
    this.forceUpdate();
  }

  onFormSubmit(e) {
    e.preventDefault();
    let form = this.state.form;
    if (form.validate())
      this.props.onSubmit(form.cleanedData);
  }

  render() {
    let fields = this.state.form.boundFieldsObj();
    return (
      <form className="payment-form">
        {this.props.customAmount ?
          <div className="payment-form--amount row">
            <h2>Amount: £<FormField field={fields.amount} /></h2>
          </div> : ""}

        <div className="payment-form--credit-card">
          <div className="row payment-form--title">
            <h3>Card Details</h3>
          </div>
          <div className="row">
            <div className="longNumber">
              <FormField field={fields.number} />
              <span className={"card-type " + PaymentUtils.getCardType(this.state.form.data.number)}></span>
            </div>
            <FormField className="cvc" field={fields.cvc} />
          </div>

          <div className="row">
            <FormField className="nameOnCard" field={fields.name} />

            <div className="exp">
              <FormField className="month" field={fields.exp} />
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