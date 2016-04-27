import React, { Component, PropTypes } from "react";
import { autobind } from "core-decorators";
import { connect } from "react-redux";
import { replace } from "react-router-redux";
import DocumentTitle from "react-document-title";

import { createUserAndAuthenticate } from "../actions/user";

import SignupForm from "../components/SignupForm";

const mapStateToProps = (state, ownProps) => {
  const { state: authState, authDidFail, failureReason } = state.authentication;
  const isAuthenticated = authState === "authenticated";

  return { isAuthenticated }
}

@connect(mapStateToProps)
export default class SignupPage extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    dispatch: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.checkAuth(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.checkAuth(nextProps)
  }

  checkAuth(props) {
    const { dispatch, isAuthenticated, location } = props

    if (isAuthenticated) {
      const redirectAfterLogin = location.state && location.state.returnTo || '/';

      dispatch(replace(redirectAfterLogin))
    }
  }

  @autobind
  handleSubmit(user) {
    const { dispatch } = this.props;

    dispatch(createUserAndAuthenticate(user));
  }

  render() {
    const { location } = this.props;
    const redirectAfterLogin = location.state && location.state.returnTo || '/';

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

            <SignupForm onSubmit={this.handleSubmit} returnTo={redirectAfterLogin} />
          </div>
        </section>
      </DocumentTitle>
    );
  }
}
