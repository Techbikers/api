import { createSelector } from "reselect";

import { getCurrentEntity } from "techbikers/app/selectors";
import { getCurrentRide } from "techbikers/rides/selectors";

const getChapters = state => state.entities.chapter || {};

export const getAllChapters = createSelector(
  [getChapters],
  chapters => Object.values(chapters)
);

export const getCurrentChapter = createSelector(
  [getAllChapters, getCurrentEntity],
  (chapters, entity) => chapters.find(
    chapter => chapter.name.toLowerCase() === entity.name.toLowerCase()
  )
);

export const getChapterForCurrentRide = createSelector(
  [getChapters, getCurrentRide],
  (chapters, ride) => chapters[ride ? ride.chapter : null]
);
