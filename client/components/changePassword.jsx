import React, { Component } from "react";
import Marty from "marty";

class ChangePassword extends Component {
  render() {
    return (
      <div>
        <h1>Change Your Password</h1>
        <form>
          <div class="row centerText">
              <input name="oldpassword" type="password" />
          </div>
          <div class="row centerText">
              <input name="newpassword1" type="password" />
          </div>
          <div class="row centerText">
              <input name="newpassword2" type="password" />
          </div>
          <div class="row">
            <p class="centerText">
              <input type="submit" class="btn btn-primary" value="Change Password"/>
            </p>
          </div>
        </form>
      </div>
    );
  }
}

export default ChangePassword;