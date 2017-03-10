import React, { Component, PropTypes } from "react";
import { autobind } from "core-decorators";
import forms, { Form } from "newforms";
import { Link } from "react-router";

import FormField from "techbikers/components/FormField";

const LoginFormSchema = Form.extend({
  email: forms.EmailField(),
  password: forms.CharField({ widget: forms.PasswordInput }),
});

export default class LoginForm extends Component {
  static propTypes = {
    returnTo: PropTypes.string,
    onSubmit: PropTypes.func.isRequired
  };

  constructor(options) {
    super(options);
    this.state = {
      form: new LoginFormSchema({ onChange: this.onFormChange })
    };
  }

  @autobind
  onFormChange() {
    this.forceUpdate();
  }

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.form.validate()) {
      const { email, password } = this.state.form.cleanedData;
      this.props.onSubmit(email, password);
    }
  };

  render() {
    const { returnTo } = this.props;
    const fields = this.state.form.boundFieldsObj();

    return (
      <form id="loginform" role="form" onSubmit={this.handleSubmit}>
        <div className="row">
          {Object.keys(fields).map(key =>
            <FormField key={fields[key].htmlName} field={fields[key]} className="span2 offset2" />
          )}
        </div>
        <div className="row centerText">
          <div className="span6">
            <input type="submit" value="Login" className="btn" />
          </div>
          <div className="span6">
            Don"t have an account yet? <Link to={{ pathname: "/signup", state: { modal: true, returnTo } }}>Create one!</Link>
            <br/>
            <Link to={{ pathname: "/password/reset", state: { modal: true, returnTo } }}>Forgotten your password?</Link>
          </div>
        </div>
      </form>
    );
  }
}
