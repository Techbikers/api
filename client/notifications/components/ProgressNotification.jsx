import React, { PropTypes } from "react";
import cx from "classnames";

import Notification from "techbikers/notifications/components/Notification";

import styles from "./ProgressNotification.css";

const ProgressNotification = ({ className, text, progress }) => (
  <Notification className={cx(styles.ProgressNotification, className)}>
    <div className={styles.progressBarOuter}>
      <div className={styles.progressBarInner} style={{ width: `${progress}%` }} />
    </div>
    <span className={styles.text}>{text}</span>
  </Notification>
);

ProgressNotification.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired
};

export default ProgressNotification;
