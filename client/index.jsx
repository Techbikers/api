import React from "react";
import Marty, { ApplicationContainer } from "marty";
import Application from "./application";

let app = new Application();

window.React = React;
window.Marty = Marty;

Marty.HttpStateSource.removeHook('parseJSON');

app.router.run((Handler, state) => {
  app.navigationActions.changeRoute(state, Handler);

  React.render((
      <ApplicationContainer app={app}>
        <Handler {...state} />
      </ApplicationContainer>
    ), document.getElementById('app'));
});