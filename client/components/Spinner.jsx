import React, { PropTypes } from "react";
import cx from "classnames";

import styles from "./Spinner.css";

const Spinner = ({ noMargin = false, size = 56, light = false, className, children }) => (
  <div
    className={cx(styles.Spinner, { [styles.noMargin]: noMargin, [styles.light]: light }, className)}
    style={{ fontSize: size }}
  >
    <div className={styles.loader}>
      <div className={styles.cube1} />
      <div className={styles.cube2} />
    </div>
    {children &&
      <div className={styles.message}>
        {children}
      </div>
    }
  </div>
);

Spinner.propTypes = {
  noMargin: PropTypes.bool,
  size: PropTypes.number,
  light: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node
};

export default Spinner;
