import React from "react";

const ChangePasswordForm = () => (
  <form>
    <h1>Change Your Password</h1>
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
);

export default ChangePasswordForm;