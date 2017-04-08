import React from "react";
import DocumentTitle from "react-document-title";

import requireAnonymity from "techbikers/auth/containers/requireAnonymity";
import SignupForm from "techbikers/auth/containers/SignupForm";
import Errors from "techbikers/errors/containers/Errors";

const SignupPage = () => (
  <DocumentTitle title="Signup – Techbikers">
    <section>
      <header>
        <h1>Register for Techbikers</h1>
      </header>

      <div className="content">
        <p className="centerText">
            In order to sign up for one of our rides we need you to register an account.
        </p>
        <Errors errorKey="signup" />
        <SignupForm />
      </div>
    </section>
  </DocumentTitle>
);

export default requireAnonymity()(SignupPage);
