import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { replace } from "react-router-redux";
import { locationShape } from "react-router";
import DocumentTitle from "react-document-title";

import { authenticateUser } from "techbikers/auth/actions";

import ErrorMessage from "techbikers/components/ErrorMessage";
import LoginForm from "techbikers/auth/components/LoginForm";

const mapStateToProps = state => {
  const { errors } = state;
  const { state: authState, authDidFail, failureReason } = state.auth;
  const isAuthenticated = authState === "authenticated";

  return { isAuthenticated, authDidFail, failureReason, errors };
};

const mapDispatchToProps = {
  replace,
  handleLogin: authenticateUser
};

@connect(mapStateToProps, mapDispatchToProps)
export default class LoginPage extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    authDidFail: PropTypes.bool,
    failureReason: PropTypes.string,
    location: locationShape,
    errors: PropTypes.string,
    replace: PropTypes.func.isRequired,
    handleLogin: PropTypes.func.isRequired
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

  render() {
    const { location, errors, handleLogin } = this.props;
    const redirectAfterLogin = location.state && location.state.returnTo || "/";

    return (
      <DocumentTitle title="Login – Techbikers">
        <section id="login">
          <header>
            <h1>Login</h1>
          </header>
          <div className="content">
            <ErrorMessage errors={errors} />
            <LoginForm
              onSubmit={handleLogin}
              returnTo={redirectAfterLogin}
              error={errors} />
          </div>
        </section>
      </DocumentTitle>
    );
  }
}
