import moment from "moment";
import React, { PropTypes } from "react";

const Timestamp = ({ value, relative = false, format = "YYYY-MM-DDTHH:mm:ssZ", locale, ...props }) => {
  let humanReadable;

  if (!moment.isMoment(value)) {
    humanReadable = moment(value);
  }

  if (locale) {
    humanReadable = value.locale(this.props.locale);
  }

  return (
    <time dateTime={humanReadable.format("YYYY-MM-DDTHH:mm:ssZ")} {...props}>
      {relative ? humanReadable.fromNow() : humanReadable.format(format)}
    </time>
  );
};

Timestamp.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(moment.fn.constructor),
    PropTypes.instanceOf(Date),
    PropTypes.number,
    PropTypes.string
  ]),
  relative: PropTypes.bool,
  format: PropTypes.string,
  locale: PropTypes.string
};

export default Timestamp;
