import { createAction } from "redux-actions";

export const ADD_ERROR = "ADD_ERROR";
export const addError = createAction(ADD_ERROR,
  (key, type, message) => ({ key, error: { type, message } })
);

export const CLEAR_ERROR = "CLEAR_ERROR";
export const clearError = createAction(CLEAR_ERROR,
  key => ({ key })
);

export const CLEAR_ALL_ERRORS = "CLEAR_ALL_ERRORS";
export const clearAllErrors = createAction(CLEAR_ALL_ERRORS);
