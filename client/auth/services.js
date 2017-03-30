import auth0 from "auth0-js";

import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "techbikers/config";

class AuthService {
  constructor() {
    // Configure Auth0
    this.auth0 = new auth0.WebAuth({
      clientID: AUTH0_CLIENT_ID,
      domain: AUTH0_DOMAIN,
      responseType: "token id_token",
      scope: "openid email",
      redirectUri: `${window.location.origin}/login`
    });
  }

  /**
   * Validate user credentials against Auth0 and return the response
   * @param {string} username
   * @param {string} password
   */
  login = (username, password) => new Promise(resolve =>
    this.auth0.client.login({
      realm: "Username-Password-Authentication",
      username,
      password
    }, (error, response) =>
      resolve({ error, response })
    ));

  /**
   * Create a new Username-Password user
   * @param {string} email         Email address of the new user
   * @param {string} password      Password for the new user
   * @param {Object} [metadata={}] Additional metadata for that user
   */
  signup = (email, password, metadata = {}) => new Promise(resolve =>
    this.auth0.signup({
      connection: "Username-Password-Authentication",
      email,
      password,
      user_metadata: metadata // eslint-disable-line camelcase
    }, (error, response) =>
      resolve({ error, response })
    ));

  /**
   * Get user information from Auth0 using the access token
   * @param {string} accessToken - Access token for an authenticated user
   */
  userInfo = accessToken => new Promise(resolve =>
    this.auth0.client.userInfo(accessToken, (error, profile) =>
      resolve({ error, profile })
    ));

  /**
   * Change the users password (or send a password reset email if no new
   * password is given)
   * @param  {string} email    - Email address of the user
   * @param  {string} [password] - New password for the user
   */
  changePassword = (email, password) => new Promise(resolve =>
    this.auth0.changePassword({
      connection: "Username-Password-Authentication",
      email,
      password
    }, (error, response) =>
      resolve({ error, response })
    ));

}

export default new AuthService();
