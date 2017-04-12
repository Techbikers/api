/**
 * Checks that a user record is the right format
 * @param {Object} user - User object
 */
export function formatUserObject(user) {
  return {
    ...user,
    website: (user.website.indexOf("://") === -1) ?
      `http://${user.website}` :
      user.website
  };
}
