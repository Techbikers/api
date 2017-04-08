import React, { PropTypes } from "react";
import { connect } from "react-redux";
import cx from "classnames";

import { ErrorShape } from "techbikers/errors/shapes";

import styles from "./Errors.css";

const mapStateToProps = (state, props) => ({
  error: state.errors[props.errorKey]
});

const Errors = ({ error, full }) => {
  if (!error) {
    return null;
  }

  return (
    <div className={styles.Errors}>
      <div className={cx(styles.content, { [styles.full]: full })}>
        {error.message}
      </div>
    </div>
  );
};

Errors.propTypes = {
  error: ErrorShape,
  full: PropTypes.bool
};

export default connect(mapStateToProps)(Errors);
