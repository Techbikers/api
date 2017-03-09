import React, { PropTypes } from "react";
import cx from "classnames";

import styles from "./Notification.css";

const Notification = ({ className, children, ...props }) => (
  <div className={cx(styles.Notification, className)} {...props}>
    {children}
  </div>
);

Notification.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

export default Notification;
