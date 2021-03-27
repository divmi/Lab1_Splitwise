import React, { Component } from "react";
import axios from "axios";
import config from "../../config";
//import cookie from "react-cookies";
class OwsGetDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owsGetDetail: [],
      componentMounted: false,
      memberWithAmountList: [],
      groupMemberName: [],
      Currency: "",
    };
  }

  componentDidMount() {
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        const localStorageData = JSON.parse(localStorage.getItem("userData"));
        this.setState({
          Currency: localStorageData.Currency,
        });
      }
    }
    this.getGroupSummary();
  }

  componentDidUpdate(prevState) {
    if (prevState.name != this.props.name) {
      this.getGroupSummary();
    } else if (prevState.updated != this.props.updated) {
      this.getGroupSummary();
    }
  }

  GroupMemberName() {
    axios
      .get(`http://${config.ipAddress}:8000/getGroupMemberName`, {
        params: {
          groupName: this.props.name,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            groupMemberName: response.data,
          });
          this.calculateMemberSpecificTable();
        } else {
          this.setState({
            error: "Issue with Network",
            authFlag: false,
          });
        }
      })
      .catch((e) => {
        this.setState({
          error: "Issue with Network" + e,
        });
      });
  }
  getGroupSummary() {
    axios
      .get(`http://${config.ipAddress}:8000/getGroupSummary`, {
        params: {
          groupName: this.props.name,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            owsGetDetail: response.data,
          });
          this.GroupMemberName();
        } else {
          this.setState({
            error: "Please enter correct credentials",
            authFlag: false,
            owsGetDetail: [],
          });
        }
      })
      .catch((e) => {
        this.setState({
          error: "Please enter correct credentials" + e,
          owsGetDetail: [],
        });
      });
  }

  calculateMemberSpecificTable() {
    if (this.state.groupMemberName.length > 0) {
      this.setState({
        memberWithAmountList: [],
      });
      this.state.groupMemberName.map((memberName) => {
        let sum = 0;
        let sumOws = 0;
        let memberDetail = this.state.owsGetDetail.filter(
          (x) => x.MemberGets == memberName.Email
        );
        if (memberDetail.length > 0) {
          memberDetail.map((member) => {
            sum = sum + member.Amount;
          });
        }
        let memberOws = this.state.owsGetDetail.filter(
          (x) => x.MemberOws == memberName.Email
        );
        if (memberOws.length > 0) {
          memberOws.map((member) => {
            sumOws = sumOws + -member.Amount;
          });
        }
        if (
          memberName.UserProfilePic == "" ||
          memberName.UserProfilePic == null
        ) {
          memberName.UserProfilePic = "./assets/userIcon.png";
        }
        this.setState({
          memberWithAmountList: [
            ...this.state.memberWithAmountList,
            {
              Name: memberName.Name,
              Amount: sum + sumOws,
              UserProfilePic: memberName.UserProfilePic,
            },
          ],
        });
      });
    }
  }

  render() {
    let component = null;
    component = this.state.memberWithAmountList.map((detail, idx) => {
      if (detail.Amount > 0) {
        return (
          <div key={idx} className="row greenCode">
            <img
              src={detail.UserProfilePic}
              className="rounded-circle profileImage"
            ></img>
            <p style={{ fontSize: "14px", marginLeft: "5px" }}>
              {detail.Name} <br />
              gets {this.state.Currency}
              {detail.Amount.toFixed(2)} <br />
            </p>
          </div>
        );
      } else {
        let display = "";
        if (detail.Amount == 0) {
          display = (
            <label style={{ color: "GrayText" }}>
              {detail.Name} <br />
              settledUp
            </label>
          );
        } else {
          display = (
            <label>
              {detail.Name} <br />
              Ows {this.state.Currency} {detail.Amount.toFixed(2)}
            </label>
          );
        }
        return (
          <div key={idx} className="row orangeCode">
            <img
              src={detail.UserProfilePic}
              className="rounded-circle profileImage"
            ></img>

            <p style={{ fontSize: "14px", marginLeft: "5px" }}>{display}</p>
          </div>
        );
      }
    });
    return <div className="container">{component}</div>;
  }
}

export default OwsGetDetail;
