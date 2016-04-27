import { createSelector } from "reselect";

import { getCurrentRide } from "./ride";

const chapterSelector = state => state.entities.chapter || {};
const pageEntityNameSelector = state => state.page.entity.name || null;

export const getAllChapters = createSelector(
  [chapterSelector],
  (chapters) => Object.keys(chapters).map(id => chapters[id])
)

export const getCurrentChapter = createSelector(
  [getAllChapters, pageEntityNameSelector],
  (chapters, name) => chapters.find(
    chapter => chapter.name.toLowerCase() === name.toLowerCase()
  )
)

export const getChapterForCurrentRide = createSelector(
  [chapterSelector, getCurrentRide],
  (chapters, ride) => chapters[ride ? ride.chapter : null]
)