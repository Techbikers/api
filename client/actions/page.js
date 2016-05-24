export const SET_PAGE_ENTITY = "SET_PAGE_ENTITY";

export function setPageEntity(params) {
  return {
    type: SET_PAGE_ENTITY,
    entity: {
      ...params
    }
  }
}

export const CLEAR_UI_STATE = "CLEAR_UI_STATE";

export function clearUIState(stateKey) {
  return {
    type: CLEAR_UI_STATE,
    key: stateKey
  }
}

export function clearResetPasswordStatus() {
  return clearUIState("passwordResetStatus");
}

export const UPDATE_META_INFO = "UPDATE_META_INFO";

export function updatePageMeta(props) {
  return {
    type: UPDATE_META_INFO,
    props
  }
}