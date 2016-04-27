import { API_REQUEST } from "../middleware/api";

export const AUTHENTICATION_REQUEST = "AUTHENTICATION_REQUEST";
export const AUTHENTICATION_SUCCESS = "AUTHENTICATION_SUCCESS";
export const AUTHENTICATION_FAILURE = "AUTHENTICATION_FAILURE";

export function authenticateAs(email, password) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: email,
      password: password
    })
  };

  return {
    email,
    [API_REQUEST]: {
      endpoint: "/auth/token",
      fetchOptions,
      requestActionType: AUTHENTICATION_REQUEST,
      successActionType: AUTHENTICATION_SUCCESS,
      errorActionType: AUTHENTICATION_FAILURE
    }
  }
}

export const REFRESH_AUTHENTICATION_REQUEST = "REFRESH_AUTHENTICATION_REQUEST";
export const REFRESH_AUTHENTICATION_SUCCESS = "REFRESH_AUTHENTICATION_SUCCESS";
export const REFRESH_AUTHENTICATION_FAILURE = "REFRESH_AUTHENTICATION_FAILURE";

export function refreshAuthenticationToken(token) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token })
  };

  return {
    [API_REQUEST]: {
      endpoint: "/auth/token/refresh",
      fetchOptions,
      requestActionType: REFRESH_AUTHENTICATION_REQUEST,
      successActionType: REFRESH_AUTHENTICATION_SUCCESS,
      errorActionType: REFRESH_AUTHENTICATION_FAILURE
    }
  }
}

export function changePassword(email, password, newpassword1, newpassword2) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      new_password1: newpassword1,
      new_password2: newpassword2
    })
  };

  return {
    [API_REQUEST]: {
      endpoint: "/auth/token/password/change",
      fetchOptions,
      requestActionType: AUTHENTICATION_REQUEST,
      successActionType: AUTHENTICATION_SUCCESS,
      errorActionType: AUTHENTICATION_FAILURE
    }
  }
}

export const BEGIN_PASSWORD_RESET_REQUEST = "BEGIN_PASSWORD_RESET_REQUEST";
export const BEGIN_PASSWORD_RESET_SUCCESS = "BEGIN_PASSWORD_RESET_SUCCESS";
export const BEGIN_PASSWORD_RESET_FAILURE = "BEGIN_PASSWORD_RESET_FAILURE";

export function beginResetPassword(email) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  };

  return {
    [API_REQUEST]: {
      endpoint: "/auth/token/password/reset",
      fetchOptions,
      requestActionType: BEGIN_PASSWORD_RESET_REQUEST,
      successActionType: BEGIN_PASSWORD_RESET_SUCCESS,
      errorActionType: BEGIN_PASSWORD_RESET_FAILURE
    }
  }
}

export const CONFIRM_PASSWORD_RESET_REQUEST = "CONFIRM_PASSWORD_RESET_REQUEST";
export const CONFIRM_PASSWORD_RESET_SUCCESS = "CONFIRM_PASSWORD_RESET_SUCCESS";
export const CONFIRM_PASSWORD_RESET_FAILURE = "CONFIRM_PASSWORD_RESET_FAILURE";

export function confirmResetPassword(id, token, newpassword1, newpassword2) {
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uid: id,
      token,
      new_password1: newpassword1,
      new_password2: newpassword2
    })
  };

  return {
    [API_REQUEST]: {
      endpoint: "/auth/token/password/reset/confirm",
      fetchOptions,
      requestActionType: CONFIRM_PASSWORD_RESET_REQUEST,
      successActionType: CONFIRM_PASSWORD_RESET_SUCCESS,
      errorActionType: CONFIRM_PASSWORD_RESET_FAILURE
    }
  }
}

export const LOGOUT = "LOGOUT";

export function logout() {
  return { type: LOGOUT }
}