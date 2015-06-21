import _ from "lodash";
import React, { Component } from "react";
import Marty from "marty";
import { Link } from 'react-router';
import forms, { Form, RenderForm } from 'newforms';

import FormField from "./formField.jsx";
import ProgressButton from "./progressButton.jsx";

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

class Signup extends Component {

  constructor(options) {
    super(options);
    this.state = {
      form: new NewRiderForm({
        data: this.app.authStore.partialUser,
        onChange: this.onFormChange.bind(this)
      })
    };
  }

  componentWillUpdate() {
    if (this.app.authStore.isLoggedIn()) {
      this.navigateAway();
    }
  }

  componentWillMount() {
    if (this.app.authStore.isLoggedIn()) {
      this.navigateAway();
    }
  }

  navigateAway() {
    let next = this.props.query.next || 'account';
    this.app.navigationActions.navigateTo(next);
  }

  onFormChange() {
    this.forceUpdate();
  }

  createRider() {
    if (this.state.form.validate()) {
      this.refs.signupbtn.loading();
      this.app.riderActions.createRider(this.state.form.cleanedData);
    }
  }

  render() {
    let fields = _.map(this.state.form.boundFieldsObj(), (field) => {
      return (
        <FormField key={field.htmlName} field={field} />
      );
    });

    return (
      <section>
        <header>
          <h1>Register for Techbikers</h1>
        </header>

        <div className="content">
          <p className="centerText">
              In order to sign up for one of our rides we need you to register an account.
          </p>

          <form>
            <div className="row">
              <div className="span2 offset1">
                {_.slice(fields, 0, 4)}
              </div>

              <div className="span2">
                {_.slice(fields, 4, 8)}
              </div>
            </div>
            <p className="centerText">
              <Link to="login" query={{next: this.props.query.next}}>Already have an account from a previous ride?</Link>
            </p>
            <p className="centerText">
              <ProgressButton ref="signupbtn" type="submit" onClick={this.createRider.bind(this)}>
                Sign Up
              </ProgressButton>
            </p>
          </form>
        </div>
      </section>
    );
  }
}

export default Marty.createContainer(Signup, {
  listenTo: ['authStore']
});
