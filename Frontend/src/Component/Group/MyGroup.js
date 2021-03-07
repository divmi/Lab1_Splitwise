import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router-dom";
import { Label } from "reactstrap";
import GroupNotification from "./GroupNotification";
import axios from "axios";
import GroupInfo from "./GroupInfoComponent";

class MyGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      component: null,
      groupInfo: [],
    };
  }

  GroupAccepted() {
    this.setState({
      groupInfo: this.getUserDetails(),
    });
  }

  OpenGroupNotifications = () => {
    this.setState({
      component: <GroupNotification click={this.GroupAccepted.bind(this)} />,
    });
  };

  getUserDetails = () => {
    axios
      .get("http://localhost:8000/getCurrentUserGroup", {
        params: {
          email: cookie.load("cookie").Email,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("All user:" + response.data);
          this.setState(() => ({
            groupInfo: [response.data],
          }));
          console.log("Group info" + this.state.groupInfo);
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
    this.getUserDetails();
  }

  OpenGroupInfo(param) {
    this.setState({
      component: <GroupInfo name={param} />,
    });
  }

  render() {
    let redirectVar = null;
    let groupName = null;
    console.log(cookie.load("cookie"));
    if (cookie.load("cookie")) redirectVar = <Redirect to="/myGroup" />;
    else redirectVar = <Redirect to="/login" />;
    if (this.state.groupInfo != null && this.state.groupInfo.length > 0) {
      groupName = this.state.groupInfo[0].map((name, idx) => {
        return (
          <tr
            key={idx}
            style={{ verticalAlign: "center" }}
            onClick={() => this.OpenGroupInfo(name.GroupName)}
          >
            <td>
              <i className="fa fa-users"></i>
              <a key={idx}>{name.GroupName}</a>
            </td>
          </tr>
        );
      });
    }
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
                <i className="fa fa-envelope" aria-hidden="true"></i> Group
                Requests
              </button>
              <hr />
              <Label>My Groups</Label>
              <table className="table table-hover">
                <tbody>{groupName}</tbody>
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
