import { createAction } from "redux-actions";

export const UPDATE_PASSWORD_RESET_STATUS = "UPDATE_PASSWORD_RESET_STATUS";
export const updatePasswordResetStatus = createAction(UPDATE_PASSWORD_RESET_STATUS);

export const CLEAR_PASSWORD_RESET_STATUS = "CLEAR_PASSWORD_RESET_STATUS";
export const clearPasswordResetStatus = createAction(CLEAR_PASSWORD_RESET_STATUS);
