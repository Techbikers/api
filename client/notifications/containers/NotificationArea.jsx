import React, { PropTypes } from "react";
import { connect } from "react-redux";
import cx from "classnames";

import { NotificationShape } from "techbikers/notifications/shapes";

import ProgressNotification from "techbikers/notifications/components/ProgressNotification";
import TextNotification from "techbikers/notifications/components/TextNotification";

import styles from "./NotificationArea.css";

const mapStateToProps = state => {
  const { queue, byId } = state.notifications;

  if (queue.length > 0) {
    const firstId = queue[0];
    return { currentNotification: byId[firstId] };
  } else {
    return { currentNotification: null };
  }
};

const NotificationRenderer = ({ notification }) => {
  switch (notification.type) {
    case "progress":
      return <ProgressNotification {...notification} />;
    case "text":
    case "error":
      return <TextNotification {...notification} />;
    default:
      throw new Error(`Unknown notification type: ${notification.type}`);
  }
};

NotificationRenderer.propTypes = {
  notification: NotificationShape
};

const NotificationArea = ({ className, currentNotification }) => (
  <div className={cx(styles.NotificationArea, className)}>
    {currentNotification &&
      <NotificationRenderer notification={currentNotification} /> }
  </div>
);

NotificationArea.propTypes = {
  className: PropTypes.string,
  currentNotification: NotificationShape
};

export default connect(mapStateToProps)(NotificationArea);
