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
    };
  }

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
      groupNotification = this.state.userNotification[0].map((name, idx) => {
        return (
          <tr key={idx} style={{ verticalAlign: "center" }}>
            <td>{name.GroupName}</td>
            <td>
              <Button type="button">Accept</Button>
            </td>
          </tr>
        );
      });
    }
    return (
      <div className="container">
        <div className="row">Divya Mittal</div>
        <div className="row">{groupNotification}</div>
      </div>
    );
  }
}

export default GroupNotification;
