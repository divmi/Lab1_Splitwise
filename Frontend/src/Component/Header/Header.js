import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";

class Header extends Component {
  handleLogout = () => {
    cookie.remove("cookie", { path: "/" });
  };

  render() {
    var registerOrLogin = null;
    if (cookie.load("cookie")) {
      registerOrLogin = (
        <ul className="nav navbar-nav navbar-right">
          <li>
            <Link to="/" onClick={this.handleLogout}>
              <span className="glyphicon glyphicon-user"></span>Logout
            </Link>
          </li>
        </ul>
      );
      //<button onClick={this.handleLogout}>Logout</button>;
    } else {
      registerOrLogin = (
        // <ul className="nav navbar-nav navbar-right">
        //   <li>
        //     <Link to="/login">
        //       <button className="btn btn-login ">Login</button>
        //     </Link>
        //   </li>
        //   <li>
        //     <Link to="/register">
        //       <button className="btn btn-signup">Register</button>
        //     </Link>
        //   </li>
        // </ul>
        <div>
          <Link to="/login">
            <button className="btn btn-login ">Login</button>
          </Link>
          <Link to="/register">
            <button className="btn btn-signup">Register</button>
          </Link>
        </div>
      );
    }
    let redirectVar = null;
    if (cookie.load("cookie")) {
      redirectVar = <Redirect to="/home" />;
    }
    return (
      // <div className="container-fluid custom-header"> */}
      /* <nav className="navbar">
            <a className="navbar-brand py0" href="#">
              <img
                id="logo"
                className="label-custom"
                width={30}
                height={30}
                alt="Splitwise"
                src="./assets/Logo.png"
              />
              <h3 className="logo_Heading">Splitwise</h3>
            </a>
            {/* <img
                src="./assets/Logo.png"
                className="rounded float-center image-div"
                alt="Splitwise"
                width={30}
                height={30}
                title="Splitwise"
              ></img>
              <h3 className="label-custom">Splitwise</h3> */
      /* <ul className="nav navbar-nav">
              <li className="active">
                <Link to="/dashboard">Home</Link>
              </li>
              <li>
                <Link to="/create">Add a Book</Link>
              </li>
              <li>
                <Link to="/delete">Delete a Book</Link>
              </li>
            </ul> */
      /* {registerOrLogin}
          </nav>
        </div>
      </div> */

      <div className="container-fluid custom-header">
        {redirectVar}
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
          <div className="col-sm-4">{registerOrLogin}</div>
        </div>
      </div>
    );
  }
}

export default Header;
