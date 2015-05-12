import _ from 'lodash';
import Marty from 'marty';
import ActionConstants from '../constants/actionConstants';

class ChapterQueries extends Marty.Queries {
  getAllChapters() {
    return this.app.chapterAPI.getAllChapters().then(chapters => {
      this.dispatch(ActionConstants.RECEIVE_CHAPTERS, chapters);
    });
  }

  getChapterByID(id) {
    return this.app.chapterAPI.getChapter(id).then(chapter => {
      this.dispatch(ActionConstants.RECEIVE_CHAPTERS, chapter);
    });
  }

  getChapterByName(name) {
    return this.app.chapterAPI.findChapters(name).then(chapter => {
      this.dispatch(ActionConstants.RECEIVE_CHAPTERS, chapter);
    });
  }
}

export default ChapterQueries;