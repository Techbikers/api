import React, { Component } from "react";
import Marty from "marty";
import DocumentTitle from "react-document-title";

class Chapter extends Component {

  render() {
    const { chapter } = this.props;
    return (
      <DocumentTitle title={chapter.name + " Chapter – Techbikers"}>
        <div className="content">
          <section>
            <header>
              <h1>{chapter.name} Chapter</h1>
            </header>
          </section>
        </div>
      </DocumentTitle>
    );
  }
}

Chapter = Marty.createContainer(Chapter, {
  listenTo: ['chaptersStore'],
  fetch: {
    chapter() {
      return this.app.chaptersStore.getChapterByName(this.props.params.name);
    }
  }
});

export default Chapter;