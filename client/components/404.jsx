import React, { Component } from "react";
import DocumentTitle from "react-document-title";

class NotFound extends Component {
  render() {
    return (
      <DocumentTitle title="Whoops – Techbikers">
        <div>
          <h1>Can't find this!</h1>
        </div>
      </DocumentTitle>
    );
  }
}

export default NotFound;