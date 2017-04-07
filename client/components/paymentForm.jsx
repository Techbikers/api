import React, { Component, PropTypes } from "react";
import forms, { Form } from "newforms";

import Button from "techbikers/components/Button";
import PaymentUtils from "../utils/paymentUtils";
import FormField from "./FormField";

export default class PaymentForm extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    currency: PropTypes.string,
    submitText: PropTypes.string,
    minAmount: PropTypes.number,
    onSubmit: PropTypes.func.isRequired,
    customAmount: PropTypes.bool
  };

  static defaultProps = {
    submitText: "Submit",
    customAmount: true,
    minAmount: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      form: this.paymentDetailsForm()
    };
  }

  paymentDetailsForm() {
    const { minAmount, customAmount } = this.props;

    const PaymentDetailsForm = Form.extend({
      amount: forms.DecimalField({
        label: minAmount,
        required: customAmount,
        initial: minAmount,
        minValue: minAmount,
        maxDecimalPlaces: 2
      }),
      number: forms.CharField({
        initial: "",
        label: "•••• •••• •••• ••••",
        widgetAttrs: {
          onKeyPress: event => {
            PaymentUtils.restrictNumeric(event);
            PaymentUtils.restrictCardNumber(event);
            PaymentUtils.formatCardNumber(event);
          },
          onKeyDown: event => {
            PaymentUtils.formatBackCardNumber(event);
          },
          onChange: event => {
            PaymentUtils.reFormatCardNumber(event);
          },
          onPaste: event => {
            PaymentUtils.reFormatCardNumber(event);
          },
          onInput: event => {
            PaymentUtils.reFormatCardNumber(event);
          }
        }
      }),
      cvc: forms.CharField({
        label: "•••",
        maxLength: 4,
        widgetAttrs: {
          onKeyPress: event => {
            PaymentUtils.restrictNumeric(event);
            PaymentUtils.restrictCVC(event);
          },
          onPaste: event => {
            PaymentUtils.reFormatCVC(event);
          },
          onChange: event => {
            PaymentUtils.reFormatCVC(event);
          },
          onInput: event => {
            PaymentUtils.reFormatCVC(event);
          }
        }
      }),
      exp: forms.CharField({
        label: "MM / YY",
        widgetAttrs: {
          onKeyPress: event => {
            PaymentUtils.restrictNumeric(event);
            PaymentUtils.restrictExpiry(event);
            PaymentUtils.formatExpiry(event);
            PaymentUtils.formatForwardSlashAndSpace(event);
            PaymentUtils.formatForwardExpiry(event);
          },
          onKeyDown: event => {
            PaymentUtils.formatBackExpiry(event);
          },
          onChange: event => {
            PaymentUtils.reFormatExpiry(event);
          },
          onInput: event => {
            PaymentUtils.reFormatExpiry(event);
          }
        }
      }),
      name: forms.CharField({
        label: "Name on card"
      }),
      clean() {
        if (this.cleanedData.exp) {
          const { month, year } = PaymentUtils.getCardExpiryVal(this.cleanedData.exp);
          this.cleanedData["exp_month"] = month;
          this.cleanedData["exp_year"] = year;
        }
      }
    });
    return new PaymentDetailsForm({ onChange: this.onFormChange });
  }

  onFormChange = () => this.forceUpdate()

  handleFormSubmit = event => {
    event.preventDefault();
    const { form } = this.state;

    if (form.validate()) {
      this.props.onSubmit(form.cleanedData);
    }
  }

  render() {
    const fields = this.state.form.boundFieldsObj();
    const { customAmount, submitText, currency, loading } = this.props;

    return (
      <form className="payment-form" onSubmit={this.handleFormSubmit}>
        {customAmount ?
          <div className="payment-form--amount row">
            <h2>I can contribute {currency}<FormField field={fields.amount} /></h2>
          </div> : ""}

        <div className="payment-form--credit-card">
          <div className="row payment-form--title">
            <h3>Card Details</h3>
          </div>
          <div className="row">
            <div className="longNumber">
              <FormField field={fields.number} />
              <span className={`card-type ${PaymentUtils.getCardType(this.state.form.data.number)}`} />
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
          <Button type="submit" loading={loading}>
            {submitText}
          </Button>
        </div>
      </form>
    );
  }
}
