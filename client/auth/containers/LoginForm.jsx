import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import forms, { Form } from "newforms";
import { Link, locationShape } from "react-router";

import { getLocation } from "techbikers/app/selectors";
import { authenticateUser } from "techbikers/auth/actions";

import FormField from "techbikers/components/FormField";

/* eslint-disable babel/new-cap */
const LoginFormSchema = Form.extend({
  email: forms.EmailField(),
  password: forms.CharField({ widget: forms.PasswordInput }),
});
/* eslint-enable */

const mapStateToProps = state => ({
  location: getLocation(state)
});

const mapDispatchToProps = {
  login: authenticateUser
};

@connect(mapStateToProps, mapDispatchToProps)
export default class LoginForm extends Component {
  static propTypes = {
    location: locationShape,
    login: PropTypes.func.isRequired
  };

  constructor(options) {
    super(options);
    this.state = {
      form: new LoginFormSchema({ onChange: this.onFormChange })
    };
  }

  onFormChange = () => this.forceUpdate()

  handleLogin = event => {
    event.preventDefault();

    const { form } = this.state;

    if (form.validate()) {
      const { email, password } = form.cleanedData;
      this.props.login(email, password);
    }
  }

  render() {
    const { location } = this.props;
    const fields = this.state.form.boundFieldsObj();

    return (
      <form id="loginform" role="form" onSubmit={this.handleLogin}>
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
            Don"t have an account yet? <Link to={{ pathname: "/signup", state: { ...location.state } }}>Create one!</Link>
            <br/>
            <Link to={{ pathname: "/password/reset", state: { ...location.state } }}>Forgotten your password?</Link>
          </div>
        </div>
      </form>
    );
  }
}
