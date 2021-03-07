import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router-dom";
import { Label } from "reactstrap";
import GroupNotification from "./GroupNotification";

class MyGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      component: null,
    };
  }

  OpenGroupNotifications = () => {
    this.setState({
      component: <GroupNotification />,
    });
  };

  render() {
    let redirectVar = null;
    console.log(cookie.load("cookie"));
    if (cookie.load("cookie")) redirectVar = <Redirect to="/myGroup" />;
    else redirectVar = <Redirect to="/login" />;
    return (
      <div className="container fluid">
        {redirectVar}
        <div className="row">
          <div className="col col-sm-1"></div>
          <div className=" col col-sm-2 shadow-sm p-3 mb-3 bg-light rounded">
            <div
              id="dashboard-div"
              style={{ padding: 0, margin: 0, textAlign: "left", fontSize: 13 }}
            >
              <button onClick={this.OpenGroupNotifications}>
                <i className="fas fa-flag"></i> Recent activity
              </button>
              <hr />
              <Label>All Groups</Label>
              <table className="table table-hover">
                <tbody></tbody>
              </table>
            </div>
          </div>
          <div className="col col-sm-9 shadow-sm p-3 mb-5 bg-light rounded">
            {this.state.component}
          </div>
        </div>
      </div>
    );
  }
}

export default MyGroup;
