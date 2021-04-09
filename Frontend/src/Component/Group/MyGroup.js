import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Label } from "reactstrap";
import GroupNotification from "./GroupNotification";
import GroupInfo from "./GroupInfoComponent";
import { getUserDetails } from "../../actions/home";
import { connect } from "react-redux";

class MyGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      component: null,
      groupInfo: [],
      error: "",
      searchName: "",
      ID: "",
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
    console.log("GroupSearch" + this.state.searchName);
    if (typeof findGroup != "undefined") {
      <GroupInfo
        name={findGroup._id}
        groupName={findGroup.GroupName}
        groupMember={findGroup.GroupMemberInfo}
      />;
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

  componentDidMount() {
    var data;
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        data = JSON.parse(localStorage.getItem("userData"));
        this.setState({
          ID: data._id,
        });
        if (this.props.groupInfo.length == 0) {
          this.props.getUserDetails(data._id);
        }
        this.GetGroupInfo(data._id);
      }
    }
    if (this.state.component == null) {
      this.setState({
        component: <GroupNotification click={this.GroupAccepted.bind(this)} />,
      });
    }
  }

  GetGroupInfo(ID) {
    let groupInfo = [];
    this.props.groupInfo.map((info) => {
      const member = info.GroupMemberInfo.find((x) => x.ID._id == ID);
      if (typeof member != "undefined" && member.Accepted) {
        groupInfo.push(info);
      }
    });
    this.setState({
      groupInfo: groupInfo,
    });
  }

  componentDidUpdate(prevState) {
    if (prevState.groupInfo != this.props.groupInfo) {
      this.GetGroupInfo(this.state.ID);
    }
  }

  OpenGroupInfo(param) {
    this.setState({
      component: (
        <GroupInfo
          name={param._id}
          groupName={param.GroupName}
          groupMember={param.GroupMemberInfo}
        />
      ),
    });
  }

  render() {
    let redirectVar = null;
    let groupName = null;
    const data = JSON.parse(localStorage.getItem("userData"));
    if (data == null) {
      redirectVar = <Redirect to="/login" />;
    } else {
      redirectVar = <Redirect to="/myGroup" />;
    }
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
      <div className="container fluid">
        {redirectVar}
        <div className="row" style={{ marginLeft: "-50px" }}>
          <div className="setHeight col col-sm-2 p-2 shadow-sm border-right rounded no-float">
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
              <div className="input-group">
                <div className="form" style={{ width: "140px" }}>
                  <input
                    type="search"
                    data-testid="search-input-box"
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
              </table>
            </div>
          </div>
          <div
            className="setHeight col col-sm-9 shadow-sm p-2 rounded"
            style={{ marginLeft: "20px" }}
          >
            {this.state.component}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    groupInfo: state.homeReducer.groupInfo,
  };
};

export default connect(mapStateToProps, { getUserDetails })(MyGroup);
