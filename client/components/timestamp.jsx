import moment from "moment";
import React, { Component } from "react";

export default class Timestamp extends Component {

  static propTypes = {
    value: React.PropTypes.oneOfType([
      React.PropTypes.instanceOf(moment.fn.constructor),
      React.PropTypes.instanceOf(Date),
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    relative: React.PropTypes.bool,
    format: React.PropTypes.string,
    titleFormat: React.PropTypes.string,
    locale: React.PropTypes.string
  };

  static defaultProps = {
    titleFormat: 'YYYY-MM-DD HH:mm'
  };

  render() {
    var { value } = this.props;

    if (!moment.isMoment(value)) {
      value = moment(value);
    }

    if (this.props.locale) {
      value = value.locale(this.props.locale);
    }

    var machineReadable = value.format('YYYY-MM-DDTHH:mm:ssZ');

    if (this.props.relative || this.props.format) {
      var humanReadable = this.props.relative ? value.fromNow() : value.format(this.props.format);
      return (
        <time {...this.props} dateTime={machineReadable} title={this.props.relative ? value.format(this.props.titleFormat) : null}>
          {humanReadable}
        </time>
      );
    } else {
      return <time {...this.props}>{machineReadable}</time>;
    }
  }
}