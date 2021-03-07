import React, { Component } from "react";
import cookie from "react-cookies";
import axios from "axios";
import { Button } from "react-bootstrap";
// import { Redirect, Link } from "react-router-dom";
// import { Label } from "reactstrap";

class GroupNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      component: null,
      userNotification: [],
      Accepted: "",
    };
  }

  GroupRequestAccepted = (name) => {
    axios
      .post("http://localhost:8000/joinedGroup", name)
      .then((response) => {
        if (response.status === 200) {
          console.log("User Accepted Group:" + JSON.stringify(response.data));
          this.getGroupNotification();
          this.props.click();
        } else {
          this.setState({
            error: "Server Error",
          });
        }
      })
      .catch((e) => {
        this.setState({
          error: "Server Error" + e,
        });
      });
  };

  getGroupNotification = () => {
    axios
      .get("http://localhost:8000/getGroupNotification", {
        params: {
          memberID: cookie.load("cookie").Email,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Ows get detail:" + response.data);
          this.setState({
            userNotification: response.data,
          });
          console.log(
            "got data for transaction" +
              JSON.stringify(this.state.userNotification)
          );
        } else {
          this.setState({
            error: "Please enter correct credentials",
            authFlag: false,
          });
        }
      })
      .catch((e) => {
        this.setState({
          error: "Please enter correct credentials" + e,
        });
      });
  };

  componentDidMount() {
    this.getGroupNotification();
  }

  render() {
    let groupNotification;
    if (this.state.userNotification.length > 0) {
      groupNotification = this.state.userNotification.map((name, idx) => {
        return (
          <tr key={idx}>
            <td>You got a request from {name.GroupName}</td>
            <td>
              <Button
                key={idx}
                type="button"
                className="btn btn-success"
                onClick={() => this.GroupRequestAccepted(name)}
              >
                Accept
              </Button>
            </td>
          </tr>
        );
      });
    } else {
      groupNotification = (
        <tr style={{ textAlign: "center" }}>
          <td>
            <img
              src="./assets/NoGroupRequest.png"
              height={300}
              width={300}
            ></img>
            <h3 style={{ fontStyle: "italic", color: "orange" }}>
              No Group Request Found to process <i className="fas fa-smile"></i>
            </h3>
          </td>
        </tr>
      );
    }
    return (
      <div className="container">
        <div className="col col-sm-12">
          <div className="alert-success">{this.state.Accepted}</div>
          <div className="row shadow p-3 mb-12 bg-light rounded">
            <table className="table">
              <tbody>{groupNotification}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default GroupNotification;
