import _ from "lodash";
import React, { Component } from "react";
import Marty from "marty";
import { Link } from "react-router";
import DocumentTitle from "react-document-title";
import forms, { Form, RenderForm } from 'newforms';

import FormField from "./formField.jsx";
import ProgressButton from "./progressButton.jsx";

const SendResetLinkForm = Form.extend({
  email: forms.EmailField()
});

class ResetPassword extends Component {
  constructor(options) {
    super(options);
    this.state = {
      form: new SendResetLinkForm({onChange: this.onFormChange.bind(this)})
    };
  }

  componentWillUpdate() {
    if (this.props.isLoggedIn) {
      this.navigateAway();
    }
    if (this.props.reset) {
      this.refs.submitButton.success();
    }
    if (!this.props.reset && this.props.resetError) {
      this.refs.submitButton.error();
    }
  }

  componentWillMount() {
    if (this.props.isLoggedIn) {
      this.navigateAway();
    }
  }

  componentWillUnmount() {
    this.app.authActions.clearError();
  }

  navigateAway() {
    let next = this.props.query.next || 'home';
    this.app.navigationActions.navigateTo(next);
  }

  onFormChange() {
    this.forceUpdate();
  }

  sendResetLink() {
    if (this.state.form.validate()) {
      this.refs.submitButton.loading();
      this.app.authActions.emailResetPasswordLink(this.state.form.cleanedData.email);
    }
  }

  render() {
    return (
      <DocumentTitle title="Reset Password – Techbikers">
        <section>
          <header>
            <h1>Forgotten Your Password?</h1>
          </header>
          <div className="content">
            <p className="centerText">
              No problem! Just enter the email address you used to register your account with, click continue,
              and we'll send an email to that address with a link to reset your password.
            </p>
            <form id="resetpassword" role="form">
              <div className="row centerText">
                {_.map(this.state.form.boundFieldsObj(), (field) => {
                  return (
                    <FormField key={field.htmlName} field={field} className="span2 offset2" />
                  );
                })}
              </div>
              <div className="row centerText">
                <div className="span6">
                  <ProgressButton ref="submitButton" type="submit" onClick={this.sendResetLink.bind(this)}>Continue</ProgressButton>
                </div>
              </div>
            </form>
          </div>
        </section>
      </DocumentTitle>
    );
  }
}

ResetPassword = Marty.createContainer(ResetPassword, {
  listenTo: ['authStore'],
  fetch: {
    reset() {
      return this.app.authStore.passwordReset;
    },
    resetError() {
      return this.app.authStore.error;
    }
  }
});

export default ResetPassword;