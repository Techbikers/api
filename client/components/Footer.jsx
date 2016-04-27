import React from "react";

import AuthMenu from "../containers/AuthMenu";

const Footer = () => (
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

        <AuthMenu />

      </div>

      <p className="centerText">
        <a href="http://www.facebook.com/techbikers" target="_blank">Facebook</a>
        &middot;
        <a href="http://twitter.com/techbikers" target="_blank">Twitter</a>
      </p>
    </div>
  </div>
);

export default Footer;