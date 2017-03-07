import React, { Component, PropTypes } from "react";
import { autobind } from "core-decorators";
import { connect } from "react-redux";
import { replace } from "react-router-redux";
import DocumentTitle from "react-document-title";

import { createUserAndAuthenticate } from "techbikers/users/actions";

import ErrorMessage from "techbikers/components/ErrorMessage";
import SignupForm from "techbikers/auth/components/SignupForm";

const mapStateToProps = state => {
  const { errors } = state;
  const { state: authState } = state.auth;
  const isAuthenticated = authState === "authenticated";

  return { isAuthenticated, errors };
};

@connect(mapStateToProps)
export default class SignupPage extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    dispatch: PropTypes.func.isRequired
  };

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
  handleSubmit(user) {
    const { dispatch } = this.props;

    dispatch(createUserAndAuthenticate(user));
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

            <SignupForm ref="signupForm" onSubmit={this.handleSubmit} returnTo={redirectAfterLogin} />
          </div>
        </section>
      </DocumentTitle>
    );
  }
}
