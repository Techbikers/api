import React, { Component } from "react";
import { Link } from "react-router";
import { autobind } from "core-decorators";
import forms, { Form, RenderForm } from "newforms";
import { slice } from "lodash";

import FormField from "./FormField";
import ProgressButton from "./ProgressButton";
import ErrorMessage from "./ErrorMessage";

const NewRiderForm = Form.extend({
  first_name: forms.CharField(),
  last_name: forms.CharField(),
  email: forms.EmailField(),
  company: forms.CharField({required: false}),
  website: forms.URLField({required: false}),
  twitter: forms.CharField({required: false}),
  password: forms.CharField({label: "Password", widget: forms.PasswordInput}),
  password_confirm: forms.CharField({label: "Confirm password", widget: forms.PasswordInput}),

  cleanWebsite() {
    // Add a protocol if there isn't already one
    let url =  this.cleanedData.website;
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "http://" + url;
    }
    return url;
  },

  clean() {
    // Check that the passwords match
    if (this.cleanedData.password !== this.cleanedData.password_confirm) {
      let message = "Passwords don't match.";
      this.addError('password_confirm', message);
      throw forms.ValidationError(message);
    }
  }
});

export default class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: new NewRiderForm({
        onChange: this.onFormChange
      })
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.error !== nextProps.error) {
      this.refs.signupbtn.error();
    }
  }

  @autobind
  onFormChange() {
    this.forceUpdate();
  }

  @autobind
  createRider() {
    const { form } = this.state;
    const { onSubmit } = this.props;

    if (form.validate()) {
      this.refs.signupbtn.loading();

      if (typeof onSubmit === "function") {
        onSubmit(form.cleanedData);
      }
    }
  }

  render() {
    const { form } = this.state;
    const { returnTo, error } = this.props;

    const fields = form.boundFieldsObj();
    const fieldComponents = Object.keys(fields).map(key => {
      let field = fields[key];
      return <FormField key={field.htmlName} field={field} />;
    });

    return (
      <form>
        <div className="row">
          <div className="span2 offset1">
            {_.slice(fieldComponents, 0, 4)}
          </div>

          <div className="span2">
            {_.slice(fieldComponents, 4, 8)}
          </div>
        </div>
        <p className="centerText">
          <Link to={{ pathname: "/login", state: {modal: true, returnTo}}}>Already have an account from a previous ride?</Link>
        </p>
        <p className="centerText">
          <ErrorMessage error={error} />
          <ProgressButton ref="signupbtn" type="submit" onClick={this.createRider}>
            Sign Up
          </ProgressButton>
        </p>
      </form>
    );
  }
}
