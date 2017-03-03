import React from "react";
import { Route, IndexRoute } from "react-router";

// Base App
import AppContainer from "techbikers/app/containers/AppContainer";
import Home from "techbikers/app/components/pages/Home";
import About from "techbikers/app/components/pages/About";
import Charity from "techbikers/app/components/pages/Charity";
import NotFound from "techbikers/app/components/pages/NotFound";

import Account from "./containers/Account";
import AuthComplete from "./containers/AuthComplete";
import ChapterPage from "./containers/ChapterPage";
import Leaderboard from "./containers/Leaderboard";
import LoginPage from "./containers/LoginPage";
import RidePage from "./containers/RidePage";
import RidesPage from "./containers/RidesPage";
import RiderProfile from "./containers/RiderProfile";
import SponsorsPage from "./containers/SponsorsPage";
import SignupPage from "./containers/SignupPage";
import PasswordReset from "./containers/PasswordReset";
import PasswordResetConfirm from "./containers/PasswordResetConfirm";

export default (
  <Route>
    // # Auth Response Handler
    <Route path="/auth/complete/:backend" component={AuthComplete} />

    // # Main App handler
    <Route path="/" component={AppContainer}>
      // ## Core Pages
      <IndexRoute component={Home} />
      <Route path="about" component={About} />
      <Route path="the_charity" component={Charity} />
      <Route path="sponsors" component={SponsorsPage} />

      // ## Authentication and Account
      <Route path="login" component={LoginPage} />
      <Route path="signup" component={SignupPage} />
      <Route path="account" component={Account} />
      <Route path="password">
        <Route path="reset">
          <IndexRoute component={PasswordReset} />
          <Route path=":uid/:token" component={PasswordResetConfirm} />
        </Route>
      </Route>

      // ## Ride Routing
      <Route path="rides">
        <IndexRoute component={RidesPage} />
        <Route path=":id(/:slug)" component={RidePage} />
      </Route>

      // ## Rider Routing
      <Route path="riders/:id" component={RiderProfile} />

      // ## Fundraising
      <Route path="donate" component={Leaderboard} />

      // ## Chapter Routing
      <Route path="chapters">
        <Route path=":name" component={ChapterPage} />
      </Route>

      // ## Error handling
      <Route path="*" component={NotFound}/>
    </Route>
  </Route>
);
