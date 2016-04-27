import { combineReducers } from "redux";

import { SET_PAGE_ENTITY } from "../actions/page";
import { OPEN_RIDE_REGISTRATION_MODAL, CLOSE_RIDE_REGISTRATION_MODAL } from "../actions/ride";

export default combineReducers({
  entity,
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

export function ui(state = {}, { type }) {
  switch (type) {
    case OPEN_RIDE_REGISTRATION_MODAL:
       return { ...state, rideRegistrationModal: true };

    case CLOSE_RIDE_REGISTRATION_MODAL:
       return { ...state, rideRegistrationModal: false };

    default:
      return state
  }
}
