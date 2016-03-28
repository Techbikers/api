import React  from 'react';
import Router, { Route, IndexRoute } from "react-router";

// # Components
import App          from './components/app.jsx';
import AuthComplete from './components/authComplete.jsx';
import Index        from './components/index.jsx';
import About        from './components/about.jsx';
import Account      from './components/account.jsx';
import Charity      from './components/charity.jsx';
import Sponsors     from './components/sponsors.jsx';
import Leaderboard  from './components/leaderboard.jsx';
import Login        from './components/login.jsx';
import Rides        from './components/rides.jsx';
import Ride         from './components/ride.jsx';
import RiderProfile from './components/riderProfile.jsx';
import Chapter      from './components/chapter.jsx';
import NotFound     from './components/404.jsx';
import Signup       from './components/signup.jsx';
import PasswordReset  from './components/resetPassword.jsx';
import PasswordResetConfirm from './components/confirmResetPassword.jsx';

export default (
  <Route>
    // # Auth Response Handler
    <Route path="/auth/complete/:backend" component={AuthComplete} />

    // # Main App handler
    <Route path="/" component={App}>
      // ## Default route
      <IndexRoute component={Index} />

      // ## Static Page Routing
      <Route path="/about" component={About} />
      <Route path="/sponsors" component={Sponsors} />
      <Route path="/the_charity" component={Charity} />

      // ## Authentication and Account
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/account" component={Account} />
      <Route path="/password/reset" component={PasswordReset} />
      <Route path="/password/reset/:uid/:token" component={PasswordResetConfirm} />

      // ## Ride Routing
      <Route path="/rides" component={Rides} />
      <Route path="/rides/:id/:slug" component={Ride} />

      // ## Rider Routing
      <Route path="/riders/:id" component={RiderProfile} />

      // ## Fundraising
      <Route path="/donate" component={Leaderboard} />

      // ## Chapter Routing
      <Route path="/chapters/:name" component={Chapter} />

      // ## Error handling
      <Route path="*" component={NotFound}/>
    </Route>
  </Route>
);