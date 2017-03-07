import React from "react";

const ChangePasswordForm = () => (
  <form>
    <h1>Change Your Password</h1>
    <div className="row centerText">
      <input name="oldpassword" type="password" />
    </div>
    <div className="row centerText">
      <input name="newpassword1" type="password" />
    </div>
    <div className="row centerText">
      <input name="newpassword2" type="password" />
    </div>
    <div className="row">
      <p className="centerText">
        <input type="submit" className="btn btn-primary" value="Change Password"/>
      </p>
    </div>
  </form>
);

export default ChangePasswordForm;
