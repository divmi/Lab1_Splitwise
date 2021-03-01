import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import { Label } from "reactstrap";
import GroupInfo from "../Group/GroupInfoComponent";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupInfo: [],
      component: null,
    };
  }

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
    this.setState({ groupInfo: this.getUserDetails() });
    console.log(JSON.stringify(this.state.groupInfo));
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
    if (cookie.load("cookie")) redirectVar = <Redirect to="/home" />;
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
      <div className="container">
        {redirectVar}
        <div className="row">
          <div className=" col col-sm-2 shadow-sm p-3 mb-3 bg-light rounded">
            <div
              id="dashboard-div"
              style={{ padding: 0, margin: 0, textAlign: "left", fontSize: 13 }}
            >
              <Link to=".\dashboard">DashBoard</Link>
              <hr />
              <Link to=".\dashboard">
                {" "}
                <i className="fas fa-flag"></i> Recent activity
              </Link>
              <hr />
              <Label>All Groups</Label>
              <table className="table table-hover">
                <tbody>{groupName}</tbody>
              </table>
            </div>
          </div>
          <div className="col col-sm-6 shadow-sm p-3 mb-5 bg-light rounded">
            {this.state.component}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
