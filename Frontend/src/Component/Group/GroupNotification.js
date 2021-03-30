import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { getUserDetails, GroupRequestAccepted } from "../../actions/home";
import { connect } from "react-redux";

class GroupNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      component: null,
      userNotification: [],
      Accepted: "",
      ID: "",
    };
  }

  GroupRequestAccepted = (name) => {
    this.props.GroupRequestAccepted(name, this.state.ID);
    // axios
    //   .post(`http://${config.ipAddress}:8000/joinedGroup`, name)
    //   .then((response) => {
    //     if (response.status === 200) {
    //       console.log("Response received");
    //     }
    //   });
  };

  componentDidUpdate(prevState) {
    if (prevState.groupInfo != this.props.groupInfo) {
      this.getGroupNotification(this.state.ID);
    }
  }

  getGroupNotification = (ID) => {
    let userNotification = [];
    if (this.props.groupInfo.length > 0) {
      this.props.groupInfo.map((group) => {
        let member = group.GroupMemberInfo.find((x) => x.ID == ID);
        if (typeof member != "undefined") {
          if (!member.Accepted) {
            console.log("Group added successfully");
            userNotification.push(group);
          }
        }
      });
      this.setState({
        userNotification: userNotification,
      });
    }
  };

  componentDidMount() {
    var data;
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        data = JSON.parse(localStorage.getItem("userData"));
        this.setState({
          ID: data._id,
        });
        this.getGroupNotification(data._id);
      }
    }
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
const mapStateToProps = (state) => {
  return {
    groupInfo: state.homeReducer.groupInfo,
  };
};

export default connect(mapStateToProps, {
  getUserDetails,
  GroupRequestAccepted,
})(GroupNotification);
