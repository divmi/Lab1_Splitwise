import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { connect } from "react-redux";
import * as Action from "../../actions/loginAction";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      userProfilePic: null,
      Name: "",
    };
  }

  handleLogout = () => {};

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = (e) => {
    this.setState({ anchorEl: null });
    if (e.target.id == "logout") {
      this.RemoveDataFromLocalStorage();
      this.props.LogoutUser();
    }
  };

  RemoveDataFromLocalStorage() {
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        localStorage.clear();
      }
    }
  }

  render() {
    var registerOrLogin = null;
    let memberName = "";
    const data = JSON.parse(localStorage.getItem("userData"));
    if (data != null && data.token) {
      let picture = "";
      memberName = data.Name;
      if (data.UserProfilePic != null) picture = data.UserProfilePic;
      else picture = "./assets/userIcon.jpg";
      registerOrLogin = (
        <div className="col col-sm-4 p-1" style={{ textAlign: "center" }}>
          <Link
            to="/home"
            style={{
              textDecoration: "none",
              color: "white",
              marginRight: 20,
            }}
          >
            Home
          </Link>
          <img
            src={picture}
            width={30}
            height={30}
            className="rounded-circle"
          ></img>

          <Button
            className="btn btn-profile shadow-none"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            {memberName}
          </Button>
        </div>
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
    if (data != null && data.token) {
      redirectVar = <Redirect to="/home" />;
    } else redirectVar = <Redirect to="/landing" />;

    return (
      <div
        className="container-flex custom-header shadow"
        style={{ marginBottom: 10 }}
      >
        {redirectVar}
        <div className="row">
          <div className="col col-sm-2"></div>
          <div className="col col-sm-3" style={{ textAlign: "center" }}>
            <div className="row " style={{ flexWrap: "nowrap" }}>
              <img
                src={"./assets/Logo.png"}
                className="rounded float-center customMargin profileImage"
              ></img>
              <h3 className="label-custom customMargin">Splitwise</h3>
            </div>
          </div>
          <div className="col col-sm-3"></div>
          {registerOrLogin}
        </div>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
        >
          <Link
            to="/updateProfile"
            style={{ textDecoration: "none", color: "black" }}
          >
            <MenuItem onClick={this.handleClose}> My account</MenuItem>
          </Link>
          <Link
            to="/createGroup"
            style={{ textDecoration: "none", color: "black" }}
          >
            <MenuItem onClick={this.handleClose}>Create Group</MenuItem>
          </Link>
          <Link
            to="/myGroup"
            style={{ textDecoration: "none", color: "black" }}
          >
            <MenuItem onClick={this.handleClose}>My Group</MenuItem>
          </Link>
          <Link to="/login" style={{ textDecoration: "none", color: "black" }}>
            <MenuItem id="logout" onClick={this.handleClose}>
              Logout
            </MenuItem>
          </Link>
        </Menu>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    LogoutUser: () => dispatch(Action.userLogout()),
  };
}

export default connect(null, mapDispatchToProps)(Header); //
