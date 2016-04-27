import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import DocumentTitle from "react-document-title";

import { getCurrentChapter } from "../selectors/chapter";
import { getChapterByName } from "../actions/chapter";

import Spinner from "../components/Spinner";

const mapStateToProps = (state, ownProps) => {
  return {
    chapter: getCurrentChapter(state)
  }
}

@connect(mapStateToProps)
export default class ChapterPage extends Component {
  static propTypes = {
    chapter: PropTypes.object
  };

  componentWillMount() {
    const { dispatch, params } = this.props;
    dispatch(getChapterByName(params.name))
  }

  render() {
    const { chapter } = this.props;

    if (!chapter) {
      return <Spinner message="loading ride details" />;
    } else {
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
}
