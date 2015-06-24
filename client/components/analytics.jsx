import React, { Component } from "react";
import Marty from "marty";
import ActionConstants from "../constants/actionConstants";


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
class AnalyticsLoader extends Component {
  static propTypes = {
    gaTrackingId: React.PropTypes.string.isRequired
  }

  constructor(options) {
    super(options);
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

      // Listen to the dispatcher so we can log actions as
      // events in Google Analytics (we ignore the CHANGE_ROUTE)
      // action as we use this for page tracking.
      this.app.dispatcher.register(action => {
        switch (action.type) {
          case ActionConstants.CHANGE_ROUTE:
            ga('send', 'pageview', { 'page': action.arguments[0].path });
            break;
          default:
            ga('send', 'event', 'Action', action.type, this.app.router.getCurrentPath());
        }
      });
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

export default Marty.createContainer(AnalyticsLoader);