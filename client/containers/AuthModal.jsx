import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { autobind } from "core-decorators";
import { merge } from "lodash";
import classNames from "classnames";
import Modal from "react-modal";

import { modalStyles } from "../utils/modal";
import { authenticateAs, closeAuthModal } from "../actions/authentication";
import LoginForm from "../components/LoginForm";

const mapStateToProps = (state, ownProps) => {
  const { state: authState, authDidFail, failureReason } = state.authentication;
  const { authModalOpen } = state.page.ui;
  const isAuthenticated = authState === "authenticated";

  return { isAuthenticated, authDidFail, failureReason, authModalOpen }
}

@connect(mapStateToProps)
export default class LoginModal extends Component {
  static propTypes = {
    authModalOpen: PropTypes.bool,
    isAuthenticated: PropTypes.bool,
    authDidFail: PropTypes.bool,
    failureReason: PropTypes.string,
    dispatch: PropTypes.func.isRequired
  };

  @autobind
  closeAuthModal(props) {
    const { dispatch } = this.props;
    dispatch(closeAuthModal());
  }

  @autobind
  handleSubmit(email, password) {
    const { dispatch } = this.props;
    dispatch(authenticateAs(email, password));
  }

  render() {
    const { children, isAuthenticated, authModalOpen, ...props } = this.props;

    return (
      <Modal style={modalStyles} isOpen={authModalOpen} onRequestClose={this.closeAuthModal} {...props}>
        <section id="login">
          <header>
            <h1>Login</h1>
          </header>
          <div className="content">
            <LoginForm onSubmit={this.handleSubmit} />
          </div>
        </section>
      </Modal>
    );
  }
}