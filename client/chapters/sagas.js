import { takeEvery, call, fork } from "redux-saga/effects";
import { schema } from "normalizr";

import { callApi } from "techbikers/utils/api";
import * as actions from "techbikers/chapters/actions";

export const ChapterSchema = new schema.Entity("chapter");

/**
 * Call the API to fetch a chapter by its name
 * @param  {string} payload - The name of the chapter
 */
export function* fetchChapterByName({ payload }) {
  return yield call(callApi, `/chapters/?search=${payload}`, {}, [ChapterSchema]);
}

export default function* root() {
  yield [
    fork(takeEvery, actions.FETCH_CHAPTER_BY_NAME, fetchChapterByName)
  ];
}
