import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import { authCallback } from "techbikers/auth/actions";

import Spinner from "techbikers/components/Spinner";

const mapDispatchToProps = {
  authCallback
};

@connect(null, mapDispatchToProps)
export default class AuthComplete extends Component {
  static propTypes = {
    authCallback: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.authCallback(window.location.hash);
  }

  render() {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
}
