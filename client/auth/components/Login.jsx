import React from "react";
import DocumentTitle from "react-document-title";

import requireAnonymity from "techbikers/auth/containers/requireAnonymity";
import LoginForm from "techbikers/auth/containers/LoginForm";

const LoginPage = () => (
  <DocumentTitle title="Login – Techbikers">
    <section id="login">
      <header>
        <h1>Login</h1>
      </header>
      <div className="content">
        <LoginForm />
      </div>
    </section>
  </DocumentTitle>
);

export default requireAnonymity()(LoginPage);
