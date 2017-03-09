import { delay } from "redux-saga";
import { takeEvery, fork, put } from "redux-saga/effects";

import * as actions from "techbikers/notifications/actions";

function* createNotification({ payload }) {
  if (payload.timeout) {
    yield delay(payload.timeout);
    yield put(actions.dismissNotification(payload.id));
  }
}

/**
 * Listen for progress updates and make sure we close
 * the notification once progress hits 100%
 * @param  {Object} payload           - action payload
 * @param  {number} payload.id        - id of the notification
 * @param  {number} payload.progress  - progess of the notification
 */
function* updateProgess({ payload }) {
  if (payload.progress === 100) {
    yield delay(2000);
    yield put(actions.dismissNotification(payload.id));
  }
}

export default function* root() {
  yield [
    fork(takeEvery, actions.CREATE_NOTIFICATION, createNotification),
    fork(takeEvery, actions.UPDATE_PROGRESS_NOTIFICATION, updateProgess)
  ];
}
