import React, { Component } from "react";
import { Nav, NavLink, NavItem } from "reactstrap";

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container-fluid">
        <div
          className="col-sm-3"
          id="dashboard-div"
          style={{ padding: 0, margin: 0, textAlign: "left" }}
        >
          <Nav vertical>
            <NavItem>
              <NavLink href="#">Link</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Link</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Another Link</NavLink>
            </NavItem>
            <NavItem>
              <NavLink disabled href="#">
                Disabled Link
              </NavLink>
            </NavItem>
          </Nav>
          <hr />
          <p>Link based</p>
          <Nav vertical>
            <NavLink href="#">Link</NavLink> <NavLink href="#">Link</NavLink>{" "}
            <NavLink href="#">Another Link</NavLink>{" "}
            <NavLink disabled href="#">
              Disabled Link
            </NavLink>
          </Nav>
        </div>
        <div className="col com-sm-6"></div>
        <div className="col com-sm-3"></div>
      </div>
    );
  }
}

export default Dashboard;
