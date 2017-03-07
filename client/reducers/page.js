import { merge } from "lodash";
import { combineReducers } from "redux";

import {
  SET_PAGE_ENTITY,
  UPDATE_META_INFO,
  CLEAR_UI_STATE } from "../actions/page";
import {
  OPEN_RIDE_REGISTRATION_MODAL,
  CLOSE_RIDE_REGISTRATION_MODAL } from "techbikers/rides/actions";
import {
  BEGIN_PASSWORD_RESET_REQUEST,
  BEGIN_PASSWORD_RESET_SUCCESS } from "techbikers/auth/actions";

export default combineReducers({
  entity,
  meta,
  ui
});

export function entity(state = {}, { type, entity}) {
  switch(type) {
    case SET_PAGE_ENTITY:
      return entity;
    default:
     return state;
  }
}

export function meta(state = {}, { type, props}) {
  if (type === UPDATE_META_INFO) {
    return merge({}, state, props);
  } else {
    return state;
  }
}

export function ui(state = {}, action) {
  switch (action.type) {
    case CLEAR_UI_STATE:
      return { ...state, [action.key]: null };

    case OPEN_RIDE_REGISTRATION_MODAL:
       return { ...state, rideRegistrationModal: true };

    case CLOSE_RIDE_REGISTRATION_MODAL:
       return { ...state, rideRegistrationModal: false };

    case BEGIN_PASSWORD_RESET_REQUEST:
      return { ...state, passwordResetStatus: "loading" };

    case BEGIN_PASSWORD_RESET_SUCCESS:
      return { ...state, passwordResetStatus: "emailed" };

    default:
      return state
  }
}
