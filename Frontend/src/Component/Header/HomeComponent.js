import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Label } from "reactstrap";
import GroupInfo from "../Group/GroupInfoComponent";
import TransactionDetail from "../Transaction/TransactionDetail";
import Dashboard from "../User/DashBoard";
import OwsGetDetail from "../Group/OwsGetsInfo";
import { getGroupInfo } from "../../query/query";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      component: null,
      summary: null,
      groupInfo: [],
      ID: "",
      token: ""
    };
  }

  componentDidUpdate(prevState) {
    if (prevState.data != this.props.data) {
      console.log(this.props.data.group);
      if (typeof this.props.data.group != "undefined") {
        let groupInfo = [];
        if (this.props.data.group.length > 0) {
          this.props.data.group.map(info => {
            const member = info.GroupMemberInfo.find(
              x => x.ID._id == this.state.ID
            );
            if (typeof member != "undefined" && member.Accepted) {
              groupInfo.push(info);
            }
          });
        }
        this.setState({
          groupInfo: groupInfo
        });
      }
    }
  }

  async componentDidMount() {
    let data;
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        data = JSON.parse(localStorage.getItem("userData"));
        console.log("Control reached to home page");
        this.setState({
          ID: data._id,
          token: data._token
        });

        console.log(data._id);
      }
      if (this.state.component == null) {
        if (typeof data != "undefined") {
          this.setState({
            component: <Dashboard email={data._id} />
          });
        }
      }
    }
  }

  OpenDashBoard = () => {
    this.setState({
      component: <Dashboard />
    });
  };

  OpenGroupInfo(param) {
    this.setState({
      component: (
        <GroupInfo
          name={param._id}
          groupName={param.GroupName}
          groupMember={param.GroupMemberInfo}
          groupPhoto={
            param.GroupProfilePicture == ""
              ? "../assets/userIcon.png"
              : param.GroupProfilePicture
          }
        />
      ),
      summary: (
        <OwsGetDetail
          name={param._id}
          groupName={param.GroupName}
          groupMember={param.GroupMemberInfo}
        />
      )
    });
  }

  OpenRecentActivity = () => {
    this.setState({
      component: <TransactionDetail />
    });
  };

  render() {
    let redirectVar = null;
    let groupName = null;
    const data = JSON.parse(localStorage.getItem("userData"));
    if (data.token) redirectVar = <Redirect to="/home" />;
    else redirectVar = <Redirect to="/login" />;
    if (this.state.groupInfo != null && this.state.groupInfo.length > 0) {
      groupName = this.state.groupInfo.map((name, idx) => {
        return (
          <tr
            key={idx}
            style={{ verticalAlign: "center" }}
            onClick={() => this.OpenGroupInfo(name)}
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
      <div className="container-flex">
        {redirectVar}
        <div className="row row-flex">
          <div className="setHeight col col-sm-1"></div>
          <div className="setHeight col col-sm-2 p-2 shadow-sm border-right rounded no-float">
            <div
              id="dashboard-div no-float"
              style={{ padding: 0, margin: 0, textAlign: "left", fontSize: 13 }}
            >
              <button
                className="btn shadow-none"
                onClick={this.OpenDashBoard}
                style={{ textDecoration: "none", fontSize: 13 }}
              >
                <i className="fas fa-bars"></i> DashBoard
              </button>
              <hr />
              <button
                className="btn shadow-none"
                onClick={this.OpenRecentActivity}
                style={{ textDecoration: "none", fontSize: 13 }}
              >
                <i className="fas fa-flag"></i> Recent activity
              </button>
              <hr />
              <Label>All Groups</Label>
              <table id="groupTable" className="table table-hover">
                <tbody>{groupName}</tbody>
              </table>
            </div>
          </div>
          <div className="setHeight col col-sm-8 shadow-sm p-3 mb-5 border-right rounded no-float">
            {this.state.component}
          </div>
          {/* <div className="setHeight col col-sm-2 rounded no-float"></div> */}
        </div>
      </div>
    );
  }
}
export default compose(
  graphql(getGroupInfo, {
    options: {
      variables: { _id: JSON.parse(localStorage.getItem("userData"))._id }
    }
  })
)(Home);
