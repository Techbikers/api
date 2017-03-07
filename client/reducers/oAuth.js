import { EXCHANGE_AUTHENTICATION_TOKEN_SUCCESS } from "techbikers/auth/actions";

export default function oAuth(state = null, { type, response }) {
  switch (type) {
    case EXCHANGE_AUTHENTICATION_TOKEN_SUCCESS:
      return response;
    default:
      return state;
  }
}