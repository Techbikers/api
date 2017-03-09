import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { replace } from "react-router-redux";
import DocumentTitle from "react-document-title";
import { locationShape } from "react-router";

import { createUserAndAuthenticate } from "techbikers/users/actions";

import ErrorMessage from "techbikers/components/ErrorMessage";
import SignupForm from "techbikers/auth/components/SignupForm";

const mapStateToProps = state => {
  const { errors } = state;
  const { state: authState } = state.auth;
  const isAuthenticated = authState === "authenticated";

  return { isAuthenticated, errors };
};

const mapDispatchToProps = {
  replace,
  createUserAndAuthenticate
};

@connect(mapStateToProps, mapDispatchToProps)
export default class SignupPage extends Component {
  static propTypes = {
    location: locationShape,
    isAuthenticated: PropTypes.bool,
    replace: PropTypes.func.isRequired,
    createUserAndAuthenticate: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.checkAuth(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkAuth(nextProps);
  }

  checkAuth(props) {
    const { isAuthenticated, location } = props;

    if (isAuthenticated) {
      const redirectAfterLogin = location.state && location.state.returnTo || "/";
      this.props.replace(redirectAfterLogin);
    }
  }

  handleSignup = user => {
    this.props.createUserAndAuthenticate(user);
  }

  render() {
    const { location, errors } = this.props;
    const redirectAfterLogin = location.state && location.state.returnTo || "/";

    return (
      <DocumentTitle title="Signup – Techbikers">
        <section>
          <header>
            <h1>Register for Techbikers</h1>
          </header>

          <div className="content">
            <p className="centerText">
                In order to sign up for one of our rides we need you to register an account.
            </p>

            <ErrorMessage errors={errors} />

            <SignupForm
              onSubmit={this.handleSignup}
              returnTo={redirectAfterLogin} />
          </div>
        </section>
      </DocumentTitle>
    );
  }
}
