import { arrayOf } from "normalizr";
import { API_REQUEST, chapterSchema } from "../middleware/api";

export const CHAPTERS_REQUEST = "CHAPTERS_REQUEST";
export const CHAPTERS_RESPONSE = "CHAPTERS_RESPONSE";
export const CHAPTERS_ERROR = "CHAPTERS_ERROR";

export function getChapters() {
  const schema = arrayOf(chapterSchema);

  return {
    [API_REQUEST]: {
      endpoint: "/chapters/",
      schema,
      requestActionType: CHAPTERS_REQUEST,
      successActionType: CHAPTERS_RESPONSE,
      errorActionType: CHAPTERS_ERROR
    }
  }
}

export function getChapterByName(name) {
  const schema = arrayOf(chapterSchema);

  return {
    [API_REQUEST]: {
      endpoint: `/chapters/?search=${name}`,
      schema,
      requestActionType: CHAPTERS_REQUEST,
      successActionType: CHAPTERS_RESPONSE,
      errorActionType: CHAPTERS_ERROR
    }
  }
}