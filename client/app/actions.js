import { createAction } from "redux-actions";

export const INIT = "INIT";
export const init = createAction(INIT);


export const CLEAR_UI_STATE = "CLEAR_UI_STATE";

export function clearUIState(stateKey) {
  return {
    type: CLEAR_UI_STATE,
    key: stateKey
  };
}

export function clearResetPasswordStatus() {
  return clearUIState("passwordResetStatus");
}
export const UPDATE_CURRENT_ENTITY = "UPDATE_CURRENT_ENTITY";
export const updateCurrentEntity = createAction(UPDATE_CURRENT_ENTITY,
  (id, type) => ({ id, type })
);

export const UPDATE_META_INFO = "UPDATE_META_INFO";

export function updatePageMeta(props) {
  return {
    type: UPDATE_META_INFO,
    props
  };
}

export const CLEAR_ERRORS = "CLEAR_ERRORS";

export function clearErrors() {
  return { type: CLEAR_ERRORS };
}
