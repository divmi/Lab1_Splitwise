import React, { Component } from "react";
import {
  Nav,
  NavLink,
  NavItem,
  Label,
  Container,
  Col,
  Button,
  Row,
  Navbar,
} from "reactstrap";

import { Redirect, Link } from "react-router-dom";

class Header extends Component {
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
          <div className="col-sm-3"></div>
          <div className="col-sm-3">
            <Link to="/register">
              <button className="btn btn-signup">Register</button>
            </Link>
            <Link to="/login">
              <button className="btn btn-login ">Login</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  //   <div className="container-fluid">
  //     <img
  //       src="./assets/Logo.png"
  //       class="rounded float-left"
  //       alt="..."
  //       width={30}
  //       height={30}
  //     ></img>
  //     <Nav navbar>
  //       <NavItem>
  //         <NavLink className="nav-link" to="/register">
  //           <span className="fa fa-home fa-lg"></span> Home
  //         </NavLink>
  //       </NavItem>
  //       <NavItem>
  //         <NavLink className="nav-link" to="/login">
  //           <span className="fa fa-info fa-lg"></span> About Us
  //         </NavLink>
  //       </NavItem>
  //     </Nav>
  //   </div>
  // {/* <Label className="label-Splitwise">Splitwise</Label>
  // <button
  //   className="btn btn-login align-right"
  //   type="submit"
  //   onClick={this.handleLogin}
  // >
  //   Login
  // </button>
  // <button
  //   className="btn btn-signup"
  //   type="submit"
  //   onClick={this.handleRegister}
  // >
  //   Sign Up!
  // </button> */}
}

export default Header;
