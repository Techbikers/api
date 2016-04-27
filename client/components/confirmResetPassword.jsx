import _ from "lodash";
import React, { Component } from "react";
import { Link } from "react-router";
import DocumentTitle from "react-document-title";
import forms, { Form, RenderForm } from 'newforms';

import FormField from "./FormField";
import ProgressButton from "./ProgressButton";
import Errors from "./Errors";

const ResetPasswordForm = Form.extend({
  password1: forms.CharField({
    label: "New password",
    widget: forms.PasswordInput
  }),
  password2: forms.CharField({
    label: "Confirm new password",
    widget: forms.PasswordInput
  }),

  clean: ['password1', 'password2', function() {
    if (this.cleanedData.password1 !== this.cleanedData.password2) {
      let message = "Passwords don't match.";
      this.addError('password2', message);
      throw forms.ValidationError(message);
    }
  }]
});

export default class ConfirmResetPassword extends Component {
  constructor(options) {
    super(options);
    this.state = {
      form: new ResetPasswordForm({onChange: this.onFormChange.bind(this)})
    };
  }

  componentWillUpdate() {
    if (this.props.isLoggedIn) {
      this.navigateAway();
    }
    if (this.props.error) {
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

  resetPassword() {
    if (this.state.form.validate()) {
      this.refs.submitButton.loading();
      this.app.authActions.resetPassword(
        this.props.params.uid,
        this.props.params.token,
        this.state.form.cleanedData.password1,
        this.state.form.cleanedData.password2);
    }
  }

  render() {
    return (
      <DocumentTitle title="Reset Password – Techbikers">
        <section id="login">
          <header>
            <h1>Forgotten Password?</h1>
          </header>
          <div className="content">
            <form id="loginform" role="form">
              <Errors error={this.props.error} />
              <div className="row centerText">
                {_.map(this.state.form.boundFieldsObj(), (field) => {
                  return (
                    <FormField key={field.htmlName} field={field} className="span2 offset2" />
                  );
                })}
              </div>
              <div className="row centerText">
                <div className="span6">
                  <ProgressButton ref="submitButton" type="submit" onClick={this.resetPassword.bind(this)}>Reset Password & Login</ProgressButton>
                </div>
              </div>
            </form>
          </div>
        </section>
      </DocumentTitle>
    );
  }
}
