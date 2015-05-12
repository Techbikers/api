import Marty from "marty";

class Application extends Marty.Application {
  constructor(options) {
    super(options);

    // Register Hooks
    require('./hooks/httpHooks');

    // Register Dependencies
    this.register('authActions', require('./actions/authActions.js'));
    this.register('chapterActions', require('./actions/chapterActions.js'));
    this.register('navigationActions', require('./actions/navigationActions.js'));
    this.register('rideActions', require('./actions/rideActions.js'));
    this.register('riderActions', require('./actions/riderActions.js'));

    this.register('chapterQueries', require('./queries/chapterQueries.js'));
    this.register('rideQueries', require('./queries/rideQueries.js'));
    this.register('riderQueries', require('./queries/riderQueries.js'));

    this.register('authAPI', require('./sources/authAPI.js'));
    this.register('chapterAPI', require('./sources/chapterAPI.js'));
    this.register('rideAPI', require('./sources/rideAPI.js'));
    this.register('riderAPI', require('./sources/riderAPI.js'));
    this.register('localStorage', require('./sources/localStorage.js'));

    this.register('authStore', require('./stores/authStore.js'));
    this.register('chaptersStore', require('./stores/chaptersStore.js'));
    this.register('ridersStore', require('./stores/ridersStore.js'));
    this.register('ridesStore', require('./stores/ridesStore.js'));

    this.router = require('./router');

    // Attempt to reauthenticate the user
    this.authActions.attemptReAuth();
  }
}

export default Application;