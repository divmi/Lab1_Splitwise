import React, { Component } from "react";
import { Nav, NavLink, NavItem } from "reactstrap";

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="shadow-sm p-3 mb-5 bg-light rounded">
          Small Shadow shadow
        </div>
        <div
          className="col-sm-3"
          id="dashboard-div"
          style={{ padding: 0, margin: 0, textAlign: "left" }}
        >
          <Nav vertical>
            <NavItem>
              <NavLink href="#">DashBoard</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Recent activity</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Groups</NavLink>
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

export default Home;
