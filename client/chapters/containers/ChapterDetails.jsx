import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import DocumentTitle from "react-document-title";

import { ChapterShape } from "techbikers/chapters/shapes";
import { getCurrentChapter } from "techbikers/chapters/selectors";
import { fetchChapterByName } from "techbikers/chapters/actions";

import Spinner from "techbikers/components/Spinner";

const mapStateToProps = state => ({
  chapter: getCurrentChapter(state)
});

const mapDispatchToProps = {
  fetchChapterByName
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ChapterPage extends Component {
  static propTypes = {
    chapter: ChapterShape,
    params: PropTypes.shape({
      name: PropTypes.string.isRequired
    }),
    fetchChapterByName: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { params } = this.props;
    this.props.fetchChapterByName(params.name);
  }

  render() {
    const { chapter } = this.props;

    if (!chapter) {
      return <Spinner message="loading ride details" />;
    } else {
      return (
        <DocumentTitle title={`${chapter.name} Chapter – Techbikers`}>
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
}
