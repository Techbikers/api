import React, { Component, PropTypes } from "react";


// Setup Google Analytics
if (typeof window !== "undefined" && window !== null) {
  if (window.GoogleAnalyticsObject == null) {
    window.GoogleAnalyticsObject = 'ga';
  }

  window.ga = window.ga || function() {
    (window.ga.q || (window.ga.q = [])).push(arguments);
  };
}

var ga = function() {
  return window.ga.apply(window, arguments);
};


// Main analytics component that loads the right scripts into
// the page and setups up tracking/reporting.
export default class AnalyticsLoader extends Component {
  static propTypes = {
    gaTrackingId: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      scriptIsAdded: false
    }
  }

  componentDidMount() {
    window[window.GoogleAnalyticsObject].l = new Date().getTime();

    // Add the scripts and setup tracking if it hasn't been done yet
    if (!this.state.scriptIsAdded) {
      this.addScript();

      // Add our Google Analytics Tracking ID
      ga('create', this.props.gaTrackingId, 'auto');
    }
  }

  addScript() {
    var el, s;
    this.setState({ scriptIsAdded: true });
    el = document.createElement('script');
    el.type = 'text/javascript';
    el.async = true;
    el.src = '//www.google-analytics.com/analytics.js';
    s = document.getElementsByTagName('script')[0];
    return s.parentNode.insertBefore(el, s);
  }

  render() {
    return null;
  }
};