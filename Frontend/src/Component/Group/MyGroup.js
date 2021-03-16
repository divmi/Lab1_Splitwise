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
      error: "",
      searchName: "",
    };
  }

  GroupAccepted() {
    this.setState({
      groupInfo: this.getUserDetails(),
    });
  }
  handleSearchTextbox = (e) => {
    this.setState({
      searchName: e.target.value,
      error: "",
    });
  };

  handleSearchButton = () => {
    const findGroup = this.state.groupInfo.find(
      (x) => x.GroupName == this.state.searchName
    );
    console.log("GroupSeacrh" + this.state.searchName);
    if (typeof findGroup != "undefined") {
      this.setState({
        component: <GroupInfo name={this.state.searchName} />,
      });
    } else {
      this.setState({
        error: "GroupName not found",
      });
    }
  };

  OpenGroupNotifications = () => {
    this.setState({
      component: <GroupNotification click={this.GroupAccepted.bind(this)} />,
    });
  };

  getUserDetails = () => {
    let memberID = "";
    if (cookie.load("cookie")) {
      memberID = cookie.load("cookie").Email;
    }
    axios
      .get("http://localhost:8000/getCurrentUserGroup", {
        params: {
          email: memberID,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState(() => ({
            groupInfo: response.data,
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
    if (this.state.component == null) {
      this.setState({
        component: <GroupNotification click={this.GroupAccepted.bind(this)} />,
      });
    }
  }

  OpenGroupInfo(param) {
    this.setState({
      component: <GroupInfo name={param} />,
    });
  }

  render() {
    let redirectVar = null;
    let groupName = null;
    if (cookie.load("cookie")) redirectVar = <Redirect to="/myGroup" />;
    else redirectVar = <Redirect to="/login" />;
    if (this.state.groupInfo != null && this.state.groupInfo.length > 0) {
      groupName = this.state.groupInfo.map((name, idx) => {
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
          <div className="setHeight col col-sm-1"></div>
          <div className="setHeight col col-sm-2 shadow-sm p-3 mb-3 bg-light rounded">
            <div
              id="dashboard-div"
              style={{ padding: 0, margin: 0, textAlign: "left", fontSize: 13 }}
            >
              <button
                className="btn btn-link"
                onClick={this.OpenGroupNotifications}
                style={{ textDecoration: "none", color: "black", fontSize: 13 }}
              >
                <i className="fa fa-envelope" aria-hidden="true"></i> My Group
                Requests
              </button>
              <hr />
              <button
                className="btn btn-link"
                onClick={this.OnLeaveGroup}
                style={{ textDecoration: "none", color: "black", fontSize: 13 }}
              >
                <i className="fas fa-edit" aria-hidden="true"></i> Leave Group
              </button>
              <hr />
              <div className="input-group">
                <div className="form-outline" style={{ width: "140px" }}>
                  <input
                    type="search"
                    id="form1"
                    className="form-control"
                    placeholder="Search..."
                    onChange={this.handleSearchTextbox}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={this.handleSearchButton}
                  style={{ margin: "0px", padding: "0px" }}
                >
                  <i className="fa fa-search"></i>
                </button>
                <div id="error" className="alert-danger">
                  {this.state.error}
                </div>
              </div>
              <hr />
              <Label>My Groups</Label>
              <table className="table table-hover">
                <tbody>{groupName}</tbody>
                <hr />
              </table>
            </div>
          </div>
          <div className="setHeight col col-sm-9 shadow-sm p-3 mb-5 bg-light rounded">
            {this.state.component}
          </div>
        </div>
      </div>
    );
  }
}

export default MyGroup;
