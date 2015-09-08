import React, { PropTypes, Component } from 'react';
import Router, { RouteHandler, Link } from 'react-router';
import Marty from "marty";
import _ from "lodash";
import AnalyticsLoader from "./analytics.jsx";

class App extends Component {

  static propTypes = {
    title: React.PropTypes.string
  }

  static defaultProps = {
    menu: [{
      title: "Rides",
      route: "rides"
    }, {
      title: "About",
      route: "about"
    }, {
      title: "Sponsors",
      route: "sponsors"
    }, {
      title: "Charity",
      route: "charity"
    }]
  }

  logout(e) {
    e.preventDefault();
    this.app.authActions.logout();
  }

  renderMenu() {
    return _.map(this.props.menu, (item) => {
      return <Link key={item.route} to={item.route} className="menu-item" activeClassName="menu-item__active">{item.title}</Link>;
    });
  }

  renderAuthMenu() {
    if (this.props.auth.loggedIn) {
      return (
        <div className="span2">
          <a className="userAuth" onClick={this.logout.bind(this)}>Log out</a>
          <Link to="account" className="userAuth">Account</Link>
        </div>
      );
    } else {
      return (
        <Link className="userAuth" to="login">Login to Techbikers</Link>
      );
    }
  }

  render() {
    let name = this.app.router.getCurrentPath();
    return (
      <div className={name}>
        <header role="header" className="content">
          <nav className="topNavigation">
            <Link id="logo" to="home">
              <img src="/static/img/logo@2x.png" alt="TechBikers" width="125" />
            </Link>

            {this.renderMenu()}

            <a href="http://blog.techbikers.com/">Blog</a>

            <Link className="btn btn-green donate" to="donate">Donate!</Link>
          </nav>
        </header>

        <RouteHandler {...this.props} />

        <div role="footer">
          <div className="content">
            <div className="row">
              <div className="span2">
                <nav>
                  <li><a href="mailto:hello@techbikers.com">hello@techbikers.com</a></li>
                  <li>4-5 Bonhill Street<br/>London<br/>EC2A 4BX</li>
                </nav>
              </div>

              <div className="span2">
              </div>
              {this.renderAuthMenu()}
            </div>

            <p className="centerText">
              <a href="http://www.facebook.com/techbikers" target="_blank">Facebook</a>
              &middot;
              <a href="http://twitter.com/techbikers" target="_blank">Twitter</a>
            </p>
          </div>
        </div>
        <AnalyticsLoader gaTrackingId="UA-43866664-1" />
      </div>
    );
  }
}

App = Marty.createContainer(App, {
  listenTo: ['authStore', 'ridersStore'],
  fetch() {
    let props = {
      auth: {
        loggedIn: this.app.authStore.isLoggedIn(),
        user: this.app.authStore.user
      }
    };
    return props;
  }
});

export default App;