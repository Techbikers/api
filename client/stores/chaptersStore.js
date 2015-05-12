import _ from "lodash";
import Marty from "marty";
import ActionConstants from "../constants/actionConstants";

class ChaptersStore extends Marty.Store {
  constructor(options) {
    super(options);
    this.state = {};
    this.handlers = {
      addChapters: ActionConstants.RECEIVE_CHAPTERS
    };
  }

  getAll() {
    return this.fetch({
      id: 'all-chapters',
      locally() {
        if (this.hasAlreadyFetched('all-chapters')) {
          return this.state;
        }
      },
      remotely() {
        return this.app.chapterQueries.getAllChapters();
      }
    });
  }

  getChapterByID(id) {
    return this.fetch({
      id: id,
      locally() {
        return this.state[id];
      },
      remotely() {
        return this.app.chapterQueries.getChapterByID(name);
      }
    });
  }

  getChapterByName(name) {
    return this.fetch({
      id: name,
      locally() {
        if (this.hasAlreadyFetched(name)) {
          return _.find(this.state, (chapter) => {
            return chapter.name.toLowerCase() == name.toLowerCase()
          });
        }
      },
      remotely() {
        return this.app.chapterQueries.getChapterByName(name);
      }
    });
  }

  addChapter(chapter) {
    this.addChapters([chapter]);
  }

  addChapters(chapters) {
    if (!_.isArray(chapters)) {
      chapters = [chapters];
    }

    _.each(chapters, (chapter) => {
      this.state[chapter.id] = chapter;
    });

    this.hasChanged();
  }
}

export default ChaptersStore;