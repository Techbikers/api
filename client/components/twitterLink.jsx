import React, { Component } from "react";

export default class TwitterLink extends Component {
  render() {
    const { handle } = this.props;
    return <a href={`http://www.twitter.com/${handle}`}>@{handle}</a>
  }
}
