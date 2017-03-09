import React, { PropTypes } from "react";
import cx from "classnames";

import Notification from "techbikers/notifications/components/Notification";

import styles from "./TextNotification.css";

const TextNotification = ({ className, text, type = "text" }) => (
  <Notification className={cx(styles.TextNotification, styles[type], className)}>
    <span>{text}</span>
  </Notification>
);

TextNotification.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

export default TextNotification;
