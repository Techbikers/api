import { createAction } from "redux-actions";

export const INIT = "INIT";
export const init = createAction(INIT);

export const UPDATE_CURRENT_ENTITY = "UPDATE_CURRENT_ENTITY";
export const updateCurrentEntity = createAction(UPDATE_CURRENT_ENTITY,
  (id, name, type) => ({ id, name, type })
);

export const UPDATE_META_INFO = "UPDATE_META_INFO";

export function updatePageMeta(props) {
  return {
    type: UPDATE_META_INFO,
    props
  };
}
