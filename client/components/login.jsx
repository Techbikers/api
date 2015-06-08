import _ from "lodash";
import React, { Component } from "react";
import Marty from "marty";
import { Link } from "react-router";
import DocumentTitle from "react-document-title";
import forms, { Form, RenderForm } from 'newforms';

import FormField from "./formField.jsx";

const LoginForm = Form.extend({
  email: forms.EmailField(),
  password: forms.CharField({widget: forms.PasswordInput}),
});

class Login extends Component {
  constructor(options) {
    super(options);
    this.state = {
      form: new LoginForm({onChange: this.onFormChange.bind(this)})
    };
  }

  componentWillUpdate() {
    if (this.props.isLoggedIn) {
      this.navigateAway();
    }
  }

  componentWillMount() {
    if (this.props.isLoggedIn) {
      this.navigateAway();
    }
  }

  navigateAway() {
    let next = this.props.query.next || 'home';
    this.app.navigationActions.navigateTo(next);
  }

  onFormChange() {
    this.forceUpdate();
  }

  login(e) {
    e.preventDefault();
    if (this.state.form.validate()) {
      this.app.authActions.login(this.state.form.cleanedData.email, this.state.form.cleanedData.password);
    }
  }

  render() {
    return (
      <DocumentTitle title="Login – Techbikers">
        <section id="login">
          <header>
            <h1>Login</h1>
          </header>
          <div className="content">
            <form id="loginform" role="form">
              <div className="row centerText">
                {_.map(this.state.form.boundFieldsObj(), (field) => {
                  return (
                    <FormField key={field.htmlName} field={field} className="span2 offset2" />
                  );
                })}
              </div>
              <div className="row centerText">
                <div className="span6">
                  <input type="submit" value="Login" className="btn" onClick={this.login.bind(this)} />
                </div>
                <div className="span6">
                  Don't have an account yet? <Link to="signup" query={{next: this.props.query.next}}>Create one!</Link>
                  <br/>
                  <a href="">Forgotten your password?</a>
                </div>
              </div>
            </form>
          </div>
        </section>
      </DocumentTitle>
    );
  }
}

Login = Marty.createContainer(Login, {
  listenTo: ['authStore'],
  fetch: {
    isLoggedIn() {
      return this.app.authStore.isLoggedIn();
    }
  }
});

export default Login;