import React, { Component } from "react";
import cookie from "react-cookies";

import { Link } from "react-router-dom";

class Header extends Component {
  handleLogout = () => {
    cookie.remove("cookie", { path: "/" });
  };

  render() {
    return (
      <div className="container-fluid custom-header">
        <div className="row">
          <div className="col-sm-6">
            <img
              src="./assets/Logo.png"
              className="rounded float-center image-div"
              alt="Splitwise"
              width={30}
              height={30}
              title="Splitwise"
            ></img>
            <h3 className="label-custom">Splitwise</h3>
          </div>
          <div className="col-sm-2"></div>
          <div className="col-sm-4">
            <Link to="/register">
              <button className="btn btn-signup">Register</button>
            </Link>
            <Link to="/login">
              <button className="btn btn-login ">Login</button>
            </Link>
            <button onClick={this.handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
