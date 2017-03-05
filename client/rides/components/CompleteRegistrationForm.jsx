import React, { PropTypes } from "react";
import { FormattedNumber } from "react-intl";

import { createTokenAndChargeUserForRide } from "techbikers/rides/actions";
import { RideShape, RegistrationShape } from "techbikers/rides/shapes";
import { UserShape } from "techbikers/users/shapes";
import { ChapterShape } from "techbikers/chapters/shapes";

import ErrorMessage from "techbikers/components/ErrorMessage";
import PaymentForm from "techbikers/components/PaymentForm";
import Timestamp from "techbikers/components/Timestamp";
import RegistrationSteps from "techbikers/rides/components/RegistrationSteps";

const CompleteRegistrationForm = ({ dispatch, registration, ride, user, chapter, errors }) => (
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
          We're asking for a minimum contribution of <FormattedNumber style="currency" currency={ride.currency} value={ride.price} />.</b>
        If you are able, we welcome you to pay more. This means more sponsor money goes directly to Room to Read!
      </p>

      <ErrorMessage errors={errors} />

      <PaymentForm
        submitText="Make payment & complete registration"
        onSubmit={({ amount, number, cvc, exp, name }) => dispatch(createTokenAndChargeUserForRide(ride.id, user.id, amount, { number, cvc, exp, name }, chapter.public_key))}
        customAmount
        minAmount={ride.price} />
    </div>
  </div>
);

CompleteRegistrationForm.propTypes = {
  registration: RegistrationShape,
  ride: RideShape,
  user: UserShape,
  chapter: ChapterShape,
  errors: PropTypes.string,
  dispatch: PropTypes.func.isRequired
};

export default CompleteRegistrationForm;
