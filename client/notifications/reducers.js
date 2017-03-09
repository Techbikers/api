import { combineReducers } from "redux";

import {
  CREATE_NOTIFICATION,
  DISMISS_NOTIFICATION,
  UPDATE_PROGRESS_NOTIFICATION
} from "techbikers/notifications/actions";

export default combineReducers({
  queue,
  byId
});

export function queue(state = [], { type, payload = {} }) {
  switch (type) {
    case CREATE_NOTIFICATION:
      return [...state, payload.id];
    case DISMISS_NOTIFICATION:
      return state.filter(id => id !== payload);
    default:
      return state;
  }
}

export function byId(state = {}, { type, payload = {} }) {
  const { id } = payload;
  let nextState, progress;

  switch (type) {
    case CREATE_NOTIFICATION:
      return {
        ...state,
        [id]: createNotification(payload)
      };
    case DISMISS_NOTIFICATION:
      nextState = { ...state };
      Reflect.deleteProperty(nextState, id);
      return nextState;
    case UPDATE_PROGRESS_NOTIFICATION:
      progress = payload.progress;

      if (typeof state[id] === "undefined") {
        return state;
      }
      return {
        ...state,
        [id]: {
          ...state[id],
          progress
        }
      };
    default:
      return state;
  }
}

function createNotification({ type, id, text, initialProgress }) {
  switch (type) {
    case "progress":
      return {
        id,
        type,
        text,
        progress: initialProgress
      };
    case "text":
    case "error":
      return {
        id,
        type,
        text
      };
    default:
      throw new Error(`unknown notification type: ${type}`);
  }
}
