import React  from "react";
import Router, { Route, IndexRoute } from "react-router";

// # Components & Containers
import AuthComplete from "./components/authComplete";
import IndexPage from "./components/IndexPage";
import AboutPage from "./components/AboutPage";
import CharityPage from "./components/CharityPage";
import Leaderboard  from "./components/leaderboard";
import NotFound     from "./components/NotFound";
import PasswordReset  from "./components/resetPassword";
import PasswordResetConfirm from "./components/confirmResetPassword";

import Account from "./containers/Account";
import AppContainer from "./containers/AppContainer";
import ChapterPage from "./containers/ChapterPage";
import LoginPage from "./containers/LoginPage";
import RidePage from "./containers/RidePage";
import RidesPage from "./containers/RidesPage";
import RiderProfile from "./containers/RiderProfile";
import SponsorsPage from "./containers/SponsorsPage";
import SignupPage from "./containers/SignupPage";

export default (
  <Route>
    // # Auth Response Handler
    <Route path="/auth/complete/:backend" component={AuthComplete} />

    // # Main App handler
    <Route path="/" component={AppContainer}>
      // ## Default route
      <IndexRoute component={IndexPage} />

      // ## Static Page Routing
      <Route path="about" component={AboutPage} />
      <Route path="sponsors" component={SponsorsPage} />
      <Route path="the_charity" component={CharityPage} />

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