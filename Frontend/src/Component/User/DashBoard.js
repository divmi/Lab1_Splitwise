import React, { Component } from "react";

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-3"></div>
          <div className="col-sm-3">
            <h3>Dashboard</h3>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
