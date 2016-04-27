import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class Header extends Component {
  static propTypes = {
    menu: PropTypes.array
  };

  static defaultProps = {
    menu: [{
      title: "Rides",
      route: "/rides"
    }, {
      title: "About",
      route: "/about"
    }, {
      title: "Sponsors",
      route: "/sponsors"
    }, {
      title: "Charity",
      route: "/the_charity"
    }]
  };

  render() {
    const { menu } = this.props;

    return (
      <header role="header" className="content">
        <nav className="topNavigation">
          <Link id="logo" to="/">
            <img src="/static/img/logo@2x.png" alt="TechBikers" width="125" />
          </Link>

          {menu.map(item => {
            return <Link key={item.route} to={item.route} className="menu-item" activeClassName="menu-item__active">{item.title}</Link>;
          })}

          <a href="http://blog.techbikers.com/">Blog</a>

          <Link className="btn btn-green donate" to="/donate">Donate!</Link>
        </nav>
      </header>
    );
  }
}