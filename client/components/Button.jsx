import React, { PropTypes } from "react";

import ButtonWrapper from "techbikers/components/ButtonWrapper";

const Button = ({ type = "button", ...props }) => (
  <button type={type} {...props} />
);

Button.propTypes = {
  type: PropTypes.string
};

export default ButtonWrapper()(Button);
