import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { autobind } from "core-decorators";
import { replace } from "react-router-redux";
import DocumentTitle from "react-document-title";
import forms, { Form } from "newforms";

import { confirmResetPasswordAndAuthenticate } from "techbikers/auth/actions";

import FormField from "techbikers/components/FormField";
import ErrorMessage from "techbikers/components/ErrorMessage";

const ResetPasswordForm = Form.extend({
  password1: forms.CharField({
    label: "New password",
    widget: forms.PasswordInput
  }),
  password2: forms.CharField({
    label: "Confirm new password",
    widget: forms.PasswordInput
  }),

  clean: ["password1", "password2", function () {
    if (this.cleanedData.password1 !== this.cleanedData.password2) {
      const message = "Passwords don't match.";
      this.addError("password2", message);
      throw forms.ValidationError(message);
    }
  }]
});

const mapStateToProps = state => {
  const { errors } = state;
  const { state: authState } = state.auth;
  const isAuthenticated = authState === "authenticated";

  return { isAuthenticated, errors };
};

@connect(mapStateToProps)
export default class PasswordResetConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: new ResetPasswordForm({ onChange: this.onFormChange })
    };
  }

  componentWillMount() {
    this.checkAuth(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkAuth(nextProps);
  }

  checkAuth(props) {
    const { dispatch, isAuthenticated, location } = props;

    if (isAuthenticated) {
      const redirectAfterLogin = location.state && location.state.returnTo || "/";
      dispatch(replace(redirectAfterLogin));
    }
  }

  @autobind
  onFormChange() {
    this.forceUpdate();
  }

  @autobind
  resetPassword(e) {
    e.preventDefault();
    const { form } = this.state;
    const { dispatch, params } = this.props;

    if (form.validate()) {
      const { password1, password2 } = form.cleanedData;
      dispatch(confirmResetPasswordAndAuthenticate(params.uid, params.token, password1, password2));
    }
  }

  render() {
    const fields = this.state.form.boundFieldsObj();
    const { errors } = this.props;

    return (
      <DocumentTitle title="Reset Password – Techbikers">
        <section id="login">
          <header>
            <h1>Forgotten Password?</h1>
          </header>
          <div className="content">
            <form id="loginform" role="form" onSubmit={this.resetPassword}>
              <ErrorMessage errors={errors} />
              <div className="row centerText">
                {Object.keys(fields).map(key => {
                  return (
                    <FormField key={fields[key].htmlName} field={fields[key]} className="span2 offset2" />
                  );
                })}
              </div>
              <div className="row centerText">
                <div className="span6">
                  <button className="btn btn-green" type="submit">Reset Password & Login</button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </DocumentTitle>
    );
  }
}
