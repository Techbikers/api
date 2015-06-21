import React, { Component } from "react";
import Spinner from "./spinner.jsx";

class ProgressButton extends Component {
  static propTypes = {
    onClick: React.PropTypes.func,
    onError: React.PropTypes.func,
    onSuccess: React.PropTypes.func,
    state: React.PropTypes.string
  }

  static defaultProps = {
    durationError: 1200,
    durationSuccess: 500,
    onClick: function() {}
  }

  constructor(options) {
    super(options);
    this.state = {
      disabled: false,
      currentState: this.props.state || ''
    };
  }

  render() {
    let content = () => {
      switch(this.state.currentState) {
        case 'success':
          return (
            <svg className="progress-button--checkmark" viewBox="0 0 70 70">
              <path d="m31.5,46.5l15.3,-23.2" />
              <path d="m31.5,46.5l-8.5,-7.1" />
            </svg>
          );
        case 'error':
          return (
            <svg className="progress-button--cross" viewBox="0 0 70 70">
              <path d="m35,35l-9.3,-9.3" />
              <path d="m35,35l9.3,9.3" />
              <path d="m35,35l-9.3,9.3" />
              <path d="m35,35l9.3,-9.3" />
            </svg>
          );
        case 'loading':
          return (
            <Spinner noMargin={true} />
          );
        default:
          return (
            <span>{this.props.children}</span>
          );
      }
    };

    return (
      <button className={"btn progress-button " + this.state.currentState} onClick={this.onClick.bind(this)} disabled={this.state.disabled}>
        {content()}
      </button>
    );
  }

  onClick(e) {
    e.preventDefault();
    this.props.onClick();
  }

  loading() {
    this.setState({
      disabled: true,
      currentState: "loading"
    });
  }

  notLoading() {
    this.setState({
      disabled: false,
      currentState: ""
    });
  }

  success(callback, remove) {
    this.setState({
      disabled: false,
      currentState: "success"
    });
    this._timeout = setTimeout(function() {
      callback = callback || this.props.onSuccess;
      if (callback && typeof callback === "function") {
        callback();
        if (remove) { this.setState({currentState: ''}); }
      } else {
        this.setState({currentState: ''});
      }
    }.bind(this), this.props.durationSuccess);
  }

  error(callback) {
    this.setState({
      disabled: false,
      currentState: "error"
    });
    this._timeout = setTimeout(function() {
      callback = callback || this.props.onError;
      if (callback && typeof callback === "function") {
        callback();
      }
      this.setState({currentState: ''});
    }.bind(this), this.props.durationError);
  }

  componentWillReceiveProps(nextProps) {
    switch(nextProps.state) {
      case 'success':
        this.success();
        return;
      case 'error':
        this.error();
        return;
      case 'loading':
        this.loading();
        return;
      case '':
        this.notLoading();
        return;
      default:
        return;
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timeout);
  }
}

export default ProgressButton;