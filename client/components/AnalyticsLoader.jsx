import React, { Component, PropTypes } from "react";

export default class AnalyticsLoader extends Component {
  static propTypes = {
    segmentKey: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      invoked: false
    }
  }

  componentWillMount() {
    // Add the scripts and setup tracking if it hasn't been done yet
    if (!this.state.invoked) {
      this.invoke();

      // Make the first page call to load the integrations. If
      // you'd like to manually name or tag the page, edit or
      // move this call however you'd like.
      analytics.page();
    }
  }

  invoke() {
    // Create a queue, but don't obliterate an existing one!
    let analytics = window.analytics = window.analytics || [];

    // If the real analytics.js is already on the page return.
    if (analytics.initialize) return;

    // If the snippet was invoked already show an error.
    if (analytics.invoked) {
      if (window.console && console.error) {
        console.error('Segment snippet included twice.');
      }
      return;
    }

    // Invoked flag, to make sure the snippet
    // is never invoked twice.
    analytics.invoked = true;

    // A list of the methods in Analytics.js to stub.
    analytics.methods = [
      'trackSubmit',
      'trackClick',
      'trackLink',
      'trackForm',
      'pageview',
      'identify',
      'reset',
      'group',
      'track',
      'ready',
      'alias',
      'page',
      'once',
      'off',
      'on'
    ];

    // Add a version to keep track of what's in the wild.
    analytics.SNIPPET_VERSION = '3.1.0';

    // For each of our methods, generate a queueing stub.
    for (let i = 0; i < analytics.methods.length; i++) {
      let key = analytics.methods[i];
      analytics[key] = this.factory(key);
    }

    // Load Analytics.js with your key, which will automatically
    // load the tools you've enabled for your account. Boosh!
    this.loadScript();

    // Make sure the component knows that the analytics has
    // been loaded
    this.setState({invoked: true});
  }

  factory(method) {
    // Define a factory to create stubs. These are placeholders
    // for methods in Analytics.js so that you never have to wait
    // for it to load to actually record data. The `method` is
    // stored as the first argument, so we can replay the data.
    return function() {
      let args = Array.prototype.slice.call(arguments);
      args.unshift(method);
      analytics.push(args);
      return analytics;
    };
  }

  loadScript() {
    const { segmentKey } = this.props;
    const protocol = "https:" === document.location.protocol ? "https://" : "http://";

    // Create an async script element based on your key.
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `${protocol}cdn.segment.com/analytics.js/v1/${segmentKey}/analytics.min.js`;

    // Insert our script next to the first script element.
    let first = document.getElementsByTagName("script")[0];
    first.parentNode.insertBefore(script, first);
  }

  render() {
    return null;
  }
};