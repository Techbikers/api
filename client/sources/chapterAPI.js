import _ from 'lodash';
import { format } from "util";
import Marty, { HttpStateSource } from 'marty';

class ChapterHttpAPI extends HttpStateSource {
  getAllChapters() {
    return this.get('/api/chapters').then(res => {
      return res.json();
    });
  }

  getChapter(id) {
    return this.get(format('/api/chapters/%d', id)).then(res => {
      return res.json();
    });
  }

  findChapters(term) {
    return this.get(format('/api/chapters?search=%s', term)).then(res => {
      return res.json();
    });
  }
}

export default ChapterHttpAPI;