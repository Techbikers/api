import { createAction } from "redux-actions";

let lastId = 0;

export const CREATE_NOTIFICATION = "CREATE_NOTIFICATION";
const createNotification = createAction(CREATE_NOTIFICATION,
  props => ({ id: ++lastId, ...props })
);

export function createProgressNotification(text, initialProgress = 0) {
  return createNotification({ type: "progress", text, initialProgress });
}

export function createTextNotification(text, timeout = 3000) {
  return createNotification({ type: "text", text, timeout });
}

export function createErrorNotification(text, timeout = 5000) {
  return createNotification({ type: "error", text, timeout });
}

export const DISMISS_NOTIFICATION = "DISMISS_NOTIFICATION";
export const dismissNotification = createAction(DISMISS_NOTIFICATION);

export const UPDATE_PROGRESS_NOTIFICATION = "UPDATE_PROGRESS_NOTIFICATION";
export const updateProgressNotification = createAction(UPDATE_PROGRESS_NOTIFICATION,
  (id, progress) => ({ id, progress })
);
