import { Button } from "react-bootstrap";
import React, { Component } from "react";

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row shadow p-5 mb-6 bg-light rounded">
          <div className="col col-sm-8">
            <label>
              <h3>
                <strong>DashBoard</strong>
              </h3>
            </label>
          </div>
          <div className="col col-sm-4">
            <Button
              className="btn btn-Normal"
              style={{
                alignSelf: "center",
                height: 40,
                alignContent: "center",
              }}
              type="button"
            >
              Settle Up
            </Button>
          </div>
          <br></br>
          <div className="row mb-6">
            <div className="col col-sm-4">
              <label>total balance</label>
            </div>
            <div className="col col-sm-4">
              <label>you owe</label>
            </div>
            <div className="col col-sm-4">
              <label>you are owed</label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
