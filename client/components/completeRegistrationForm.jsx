import React, { Component } from "react";
import { FormattedNumber } from "react-intl";
import forms, { Form, RenderForm } from "newforms";

import { createTokenAndChargeUserForRide } from "../actions/ride";

import ErrorMessage from "./ErrorMessage";
import PaymentForm from "./PaymentForm";
import Timestamp from "./Timestamp";
import Spinner from "./Spinner";
import RegistrationSteps from "./RegistrationSteps";

const CompleteRegistrationForm = ({dispatch, registration, ride, user, chapter, errors}) => (
  <div className="ride-registration--form">
    <RegistrationSteps step={3} />

    <div className="ride-registration--details centerText">
      <h3>Great news - we'd love to have you as part of TechBikers ride!</h3>

      {registration.signup_expires &&
        <p>
          <b>You have until <Timestamp format="D MMM" value={registration.signup_expires} /> to
          register.</b> After this you may lose your spot to someone else.</p>}

      <p>
        <b>The ride costs about <FormattedNumber style="currency" currency={ride.currency} value={ride.full_cost} /> per rider.
        We're asking for a minimum contribution of <FormattedNumber style="currency" currency={ride.currency} value={ride.price} />.</b> If
        you are able, we welcome you to pay more. This means more sponsor money goes directly to Room to Read!</p>

      <ErrorMessage errors={errors} />

      <PaymentForm
        submitText="Make payment & complete registration"
        onSubmit={({amount, number, cvc, exp, name}) => dispatch(createTokenAndChargeUserForRide(ride.id, user.id, amount, {number, cvc, exp, name}, chapter.public_key))}
        customAmount={true}
        minAmount={ride.price} />
    </div>
  </div>
);

export default CompleteRegistrationForm;
