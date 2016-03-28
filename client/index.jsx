import _ from "lodash";
import React from "react";
import { render } from "react-dom";
import Marty, { ApplicationContainer } from "marty";
import Application from "./application";
import routes from "./routes";

let app = new Application();

window.React = React;
window.Marty = Marty;

Marty.HttpStateSource.removeHook('parseJSON');

render(
  <ApplicationContainer app={app}>
    <Router history={browserHistory} children={routes} />
  </ApplicationContainer>,
  document.getElementById('app')
)
