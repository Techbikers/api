import React, { Component } from "react";

class TwitterLink extends Component {
  render() {
    // todo: actually add the logic here to form a proper twitter link
    let httpLink = "http://www.twitter.com/" + this.props.handle
    return <a href={httpLink}>@{this.props.handle}</a>
  }
}

export default TwitterLink;