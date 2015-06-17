import _ from "lodash";
import React from "react";
import Marty, { ApplicationContainer } from "marty";
import Application from "./application";

let app = new Application();

window.React = React;
window.Marty = Marty;

Marty.HttpStateSource.removeHook('parseJSON');

app.router.run((Handler, state) => {
  // Check if we have been passed user details in the url
  // This would most likely be from an email campaign where
  // we want to collect these details to try and avoid asking
  // the user to give us the same information twice.
  if (state.query.hasOwnProperty('first_name') ||
      state.query.hasOwnProperty('last_name') ||
      state.query.hasOwnProperty('email') ||
      state.query.hasOwnProperty('company') ||
      state.query.hasOwnProperty('twitter') ||
      state.query.hasOwnProperty('website')) {
    app.authActions.updatePartialUser(state.query);
    app.router.replaceWith(state.pathname, {}, _.omit(state.query, ['first_name', 'last_name', 'email', 'company', 'twitter', 'website']));
  }

  app.navigationActions.changeRoute(state, Handler);
  React.render((
      <ApplicationContainer app={app}>
        <Handler {...state} />
      </ApplicationContainer>
    ), document.getElementById('app'));
});