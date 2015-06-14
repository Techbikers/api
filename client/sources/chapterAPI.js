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

  // Joins the logged in user to the chapter as a member
  // and charges their card using the given Stripe token.
  join(id, token) {
    return this.post({
      url: format('/api/chapters/%d/members', id),
      body: {
        token: token
      }
    }).then(res => {
      return res.json();
    });
  }
}

export default ChapterHttpAPI;