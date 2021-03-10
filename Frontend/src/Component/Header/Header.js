import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect, Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { connect } from "react-redux";
import * as Action from "../../actions/actionCreators";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      userProfilePic: null,
      Name: "",
    };
    this.localStorageUpdated = this.localStorageUpdated.bind(this);
  }

  handleLogout = () => {};

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = (e) => {
    this.setState({ anchorEl: null });
    if (e.target.id == "logout") {
      cookie.remove("cookie", { path: "/" });
      this.props.LogoutUser();
    }
  };

  setProfilePic() {
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        var value = JSON.parse(localStorage.getItem("userData"));
        console.log(value.UserProfilePic);
        this.setState({
          userProfilePic: value.UserProfilePic,
          Name: value.Name,
        });
      }
      if (this.state.userProfilePic == null) {
        this.setState({
          userProfilePic: `./assets/userIcon.jpg`,
        });
      }
    }
  }

  localStorageUpdated() {
    console.log("state updated");
    this.setProfilePic();
  }

  componentDidMount() {
    this.setProfilePic();
    window.addEventListener("storage", this.localStorageUpdated);
  }

  componentDidUpdate(prevState) {
    if (prevState.userProfilePic != this.state.userProfilePic) {
      //this.setProfilePic();
    }
  }

  render() {
    var registerOrLogin = null;
    if (cookie.load("cookie")) {
      registerOrLogin = (
        <div className="col col-sm-3">
          <Link
            to="/home"
            style={{ textDecoration: "none", color: "white", marginRight: 50 }}
          >
            {" "}
            Home{" "}
          </Link>
          <img
            src={this.state.userProfilePic}
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
            {this.state.Name}
            {/* {cookie.load("cookie").Name} */}
          </Button>
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
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "black" }}
            >
              <MenuItem id="logout" onClick={this.handleClose}>
                Logout
              </MenuItem>
            </Link>
          </Menu>
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
    if (cookie.load("cookie")) {
      redirectVar = <Redirect to="/home" />;
    } else redirectVar = <Redirect to="/landing" />;

    return (
      <div className="container-fluid custom-header">
        {redirectVar}
        <div className="row">
          <div className="col col-sm-1"></div>
          <div className="col col-sm-5" style={{ textAlign: "center" }}>
            <div
              className="row "
              style={{ flexWrap: "nowrap", marginTop: 10, marginLeft: 60 }}
            >
              <img
                src="./assets/Logo.png"
                className="rounded float-center image-div"
                width={30}
                height={30}
                alt="Splitwise"
              ></img>
              <h3 className="label-custom">Splitwise</h3>
            </div>
          </div>
          <div className="col col-sm-3"></div>
          {registerOrLogin}
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    LogoutUser: () => dispatch(Action.LogoutUser()),
  };
}

export default connect(null, mapDispatchToProps)(Header);
