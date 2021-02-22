import React, { Component } from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  NavDropdown,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { Redirect, Link } from "react-router-dom";

class Header extends Component {
  handleLogout() {}

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
            <div>
              <Nav>
                <DropdownMenu
                  title={
                    <img
                      src="" //{prof_pic}
                      alt="user pic"
                      style={{ width: 40 + "px", borderRadius: 50 + "%" }}
                    />
                  }
                  id="collasible-nav-dropdown"
                >
                  <DropdownItem>
                    <Link to="/stud_prof">Profile</Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link to="/myapp">My Applications</Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link to="/myevents">My Events</Link>
                  </DropdownItem>
                  {/* <DropdownItem Divider /> */}
                  <DropdownItem>
                    <Link to="/" onClick={this.handleLogout}>
                      Logout
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
              </Nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
