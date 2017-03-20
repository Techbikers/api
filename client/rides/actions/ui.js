import { createAction } from "redux-actions";

export const OPEN_RIDE_REGISTRATION_MODAL = "OPEN_RIDE_REGISTRATION_MODAL";
export const openRideRegistrationModal = createAction(OPEN_RIDE_REGISTRATION_MODAL);

export const CLOSE_RIDE_REGISTRATION_MODAL = "CLOSE_RIDE_REGISTRATION_MODAL";
export const closeRideRegistrationModal = createAction(CLOSE_RIDE_REGISTRATION_MODAL);
