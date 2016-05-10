import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { autobind } from "core-decorators";
import { Link } from "react-router";
import { replace } from "react-router-redux";
import DocumentTitle from "react-document-title";
import forms, { Form, RenderForm } from "newforms";

import { beginResetPassword } from "../actions/authentication";
import { clearResetPasswordStatus } from "../actions/page";

import FormField from "../components/FormField";

const SendResetLinkForm = Form.extend({
  email: forms.EmailField()
});

const mapStateToProps = state => {
  const { state: authState, authDidFail, failureReason } = state.authentication;
  const isAuthenticated = authState === "authenticated";

  return {
    isAuthenticated,
    resetStatus: state.page.ui.passwordResetStatus
  };
}

@connect(mapStateToProps)
export default class PasswordReset extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      form: new SendResetLinkForm({onChange: this.onFormChange})
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
      const redirectAfterLogin = location.state && location.state.returnTo || '/';
      dispatch(replace(redirectAfterLogin));
    }
  }

  @autobind
  onFormChange() {
    this.forceUpdate();
  }

  @autobind
  sendResetLink(e) {
    e.preventDefault();

    const { form } = this.state;
    const { dispatch } = this.props;

    if (form.validate()) {
      dispatch(beginResetPassword(form.cleanedData.email));
    }
  }

  @autobind
  resetForm() {
    const { dispatch } = this.props;
    dispatch(clearResetPasswordStatus());
  }

  render() {
    const fields = this.state.form.boundFieldsObj();
    const { resetStatus } = this.props;

    return (
      <DocumentTitle title="Reset Password – Techbikers">
        <section>
          <header>
            <h1>Forgotten Your Password?</h1>
          </header>
          {resetStatus === "emailed" ?
            <div className="content centerText">
              <p className="centerText">
                OK - we've just emailed you a link to reset your password.
              </p>
              <button className="btn btn-grey" onClick={this.resetForm}>Try again</button>
            </div>
          :
            <div className="content">
              <p className="centerText">
                No problem! Just enter the email address you used to register your account with, click continue,
                and we'll send an email to that address with a link to reset your password.
              </p>
              <form id="resetpassword" role="form" onSubmit={this.sendResetLink}>
                <div className="row centerText">
                  {Object.keys(fields).map(key => {
                    return (
                      <FormField key={fields[key].htmlName} field={fields[key]} className="span2 offset2" />
                    );
                  })}
                </div>
                <div className="row centerText">
                  <div className="span6">
                    <button disabled={resetStatus === "loading"} className="btn btn-green" type="submit">Continue</button>
                  </div>
                </div>
              </form>
            </div>
          }
        </section>
      </DocumentTitle>
    );
  }
}