import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { locationShape } from "react-router";
import { isEqual } from "lodash";

import { updateCurrentEntity } from "techbikers/app/actions";

import App from "techbikers/app/components/App";

const mapDispatchToProps = {
  updateCurrentEntity
};

@connect(null, mapDispatchToProps)
export default class AppContainer extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    location: locationShape,
    params: PropTypes.shape({
      id: PropTypes.string
    }),
    updateCurrentEntity: PropTypes.func.isRequired,
  };

  updateEntity = props => {
    const { params, location } = props;
    if (params.id || params.name) {
      const type = location.pathname.split("/")[1].slice(0, -1);
      props.updateCurrentEntity(params.id && Number(params.id), params.name, type);
    }
  }

  componentWillMount() {
    // Set the entity id for this page based on the url parameters
    // (not every page will have an entity associated with it)
    this.updateEntity(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { params, location } = this.props;
    const { params: nextParams, location: nextLocation } = nextProps;

    // Set the page entity id from url params (if there is one)
    if (nextParams && params && !isEqual(nextParams, params)) {
      this.updateEntity(nextProps);
    }

    // next check if we're rendering a modal layer or not
    if (nextLocation.key !== location.key && nextLocation.state && nextLocation.state.modal) {
      // save the old children (just like animation)
      this.previousChildren = this.props.children;
    }
  }

  render() {
    const { location, children, ...props } = this.props;
    const isModal = (location.state && location.state.modal && this.previousChildren);

    return <App {...props} children={isModal ? this.previousChildren : children} modalChildren={isModal ? children : null} />;
  }
}
