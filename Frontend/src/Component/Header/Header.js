import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect, Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  handleLogout = () => {};

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = (e) => {
    this.setState({ anchorEl: null });
    if (e.target.id == "logout") {
      cookie.remove("cookie", { path: "/" });
    }
  };

  render() {
    var registerOrLogin = null;
    if (cookie.load("cookie")) {
      registerOrLogin = (
        <div className="col col-sm-3">
          <img
            src="./assets/Logo.png"
            width={30}
            height={30}
            className="rounded-circle"
          ></img>
          <Button
            className="btn btn-profile"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            {cookie.load("cookie").Name}
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={this.state.anchorEl}
            keepMounted
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleClose}
          >
            <Link to="/updateProfile" style={{ textDecoration: "none" }}>
              <MenuItem onClick={this.handleClose}> My account</MenuItem>
            </Link>
            <Link to="/createGroup" style={{ textDecoration: "none" }}>
              <MenuItem onClick={this.handleClose}>Create Group</MenuItem>
            </Link>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <MenuItem id="logout" onClick={this.handleClose}>
                Logout
              </MenuItem>
            </Link>
          </Menu>
        </div>
        // <ul className="nav navbar-nav navbar-right">
        //   <li>
        //     <Link to="/" onClick={this.handleLogout}>
        //       <span className="glyphicon glyphicon-user"></span>Logout
        //     </Link>
        //   </li>
        // </ul>
      );
    } else {
      registerOrLogin = (
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
      <div className="container-fluid custom-header">
        {redirectVar}
        <div className="row">
          <div className="col-sm-5" style={{ textAlign: "right" }}>
            <img
              src="./assets/Logo.png"
              className="rounded float-center image-div"
              width={30}
              height={30}
            ></img>
            <h3 className="label-custom">Splitwise</h3>
          </div>
          <div className="col col-sm-4"></div>
          {registerOrLogin}
        </div>
      </div>
    );
  }
}

export default Header;
