import React, { PropTypes } from "react";
import cx from "classnames";

import styles from "./SpreadBox.css";

const SpreadBox = ({ className, children }) => (
  <div className={cx(styles.SpreadBox, className)}>
    {children}
  </div>
);

SpreadBox.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default SpreadBox;
