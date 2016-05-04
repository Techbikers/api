import React, { Component, PropTypes } from "react";
import { autobind } from "core-decorators";
import { connect } from "react-redux";
import { replace } from "react-router-redux";
import { authenticateAs } from "../actions/authentication";
import DocumentTitle from "react-document-title";

import LoginForm from "../components/LoginForm";

const mapStateToProps = (state, ownProps) => {
  const { errors } = state;
  const { state: authState, authDidFail, failureReason } = state.authentication;
  const isAuthenticated = authState === "authenticated";

  return { isAuthenticated, authDidFail, failureReason, errors }
}

@connect(mapStateToProps)
export default class LoginPage extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    authDidFail: PropTypes.bool,
    failureReason: PropTypes.string,
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
  handleSubmit(email, password) {
    const { dispatch } = this.props;

    dispatch(authenticateAs(email, password));
    return false;
  }

  render() {
    const { location, errors } = this.props;
    const redirectAfterLogin = location.state && location.state.returnTo || "/";

    return (
      <DocumentTitle title="Login – Techbikers">
        <section id="login">
          <header>
            <h1>Login</h1>
          </header>
          <div className="content">
            <LoginForm onSubmit={this.handleSubmit} returnTo={redirectAfterLogin} error={errors} />
          </div>
        </section>
      </DocumentTitle>
    );
  }
}
