import React  from 'react';
import Router, { Route, DefaultRoute, NotFoundRoute } from 'react-router';

// # Components
import App          from './components/app.jsx';
import Index        from './components/index.jsx';
import About        from './components/about.jsx';
import Account      from './components/account.jsx';
import Charity      from './components/charity.jsx';
import Sponsors     from './components/sponsors.jsx';
import Login        from './components/login.jsx';
import Rides        from './components/rides.jsx';
import Ride         from './components/ride.jsx';
import RiderProfile from './components/riderProfile.jsx';
import Chapter      from './components/chapter.jsx';
import NotFound     from './components/404.jsx';

export default (
  // # Main App handler
  <Route path="/" name="home" handler={App}>
    // ## Default route
    <DefaultRoute handler={Index} />

    // ## Static Page Routing
    <Route path="/about"           name="about"    handler={About} />
    <Route path="/sponsors"        name="sponsors" handler={Sponsors} />
    <Route path="/the_charity"     name="charity"  handler={Charity} />

    // ## Authentication and Account
    <Route path="/login"           name="login"    handler={Login} />
    <Route path="/account"         name="account"  handler={Account} />

    // ## Ride Routing
    <Route path="/rides"           name="rides"    handler={Rides} />
    <Route path="/rides/:id/:slug" name="ride"     handler={Ride} />

    // ## Rider Routing
    <Route path="/riders/:id"      name="rider"    handler={RiderProfile} />

    // ## Chapter Routing
    <Route path="/chapters/:name"  name="chapter"  handler={Chapter} />

    // ## Error handling
    <NotFoundRoute handler={NotFound}/>
  </Route>
);