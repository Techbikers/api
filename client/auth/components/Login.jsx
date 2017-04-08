import React from "react";
import DocumentTitle from "react-document-title";

import requireAnonymity from "techbikers/auth/containers/requireAnonymity";
import LoginForm from "techbikers/auth/containers/LoginForm";
import Errors from "techbikers/errors/containers/Errors";

const LoginPage = () => (
  <DocumentTitle title="Login – Techbikers">
    <section id="login">
      <header>
        <h1>Login</h1>
      </header>
      <div className="content">
        <Errors errorKey="authentication" />
        <LoginForm />
      </div>
    </section>
  </DocumentTitle>
);

export default requireAnonymity()(LoginPage);
