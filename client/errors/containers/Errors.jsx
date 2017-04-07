import React from "react";
import { connect } from "react-redux";

import { ErrorShape } from "techbikers/errors/shapes";

import styles from "./Errors.css";

const mapStateToProps = (state, props) => ({
  error: state.errors[props.errorKey]
});

const Errors = ({ error }) => {
  if (!error) {
    return null;
  }

  return (
    <div className={styles.Errors}>
      {error.message}
    </div>
  );
};

Errors.propTypes = {
  error: ErrorShape
};

export default connect(mapStateToProps)(Errors);
