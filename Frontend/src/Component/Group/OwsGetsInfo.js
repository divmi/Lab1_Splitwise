import React, { Component } from "react";
import { connect } from "react-redux";
import { getGroupSummary } from "../../actions/GroupOwsGetsInfo";

//import cookie from "react-cookies";
class OwsGetDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //owsGetDetail: [],
      componentMounted: false,
      memberWithAmountList: [],
      // groupMemberName: [],
      Currency: "",
    };
  }

  componentDidMount() {
    console.log("Componnet Mounted");
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        const localStorageData = JSON.parse(localStorage.getItem("userData"));
        this.setState({
          Currency: localStorageData.Currency,
        });
      }
    }
    this.props.getGroupSummary(this.props.name);
  }

  componentDidUpdate(prevState) {
    if (prevState.name !== this.props.name) {
      this.props.getGroupSummary(this.props.name);
    } else if (prevState.groupMemberName !== this.props.groupMemberName) {
      this.calculateMemberSpecificTable();
    } else if (prevState.updated !== this.props.updated) {
      this.props.getGroupSummary(this.props.name);
      this.calculateMemberSpecificTable();
    }
  }

  // GroupMemberName() {
  //   axios
  //     .get(`http://${config.ipAddress}:8000/getGroupMemberName`, {
  //       params: {
  //         groupName: this.props.name,
  //       },
  //     })
  //     .then((response) => {
  //       if (response.status === 200) {
  //         this.setState({
  //           groupMemberName: response.data,
  //         });
  //         this.calculateMemberSpecificTable();
  //       } else {
  //         this.setState({
  //           error: "Issue with Network",
  //           authFlag: false,
  //         });
  //       }
  //     })
  //     .catch((e) => {
  //       this.setState({
  //         error: "Issue with Network" + e,
  //       });
  //     });
  // }
  // getGroupSummary() {
  //   axios
  //     .get(`http://${config.ipAddress}:8000/getGroupSummary`, {
  //       params: {
  //         groupName: this.props.name,
  //       },
  //     })
  //     .then((response) => {
  //       if (response.status === 200) {
  //         this.setState({
  //           owsGetDetail: response.data,
  //         });
  //         this.GroupMemberName();
  //       } else {
  //         this.setState({
  //           error: "Please enter correct credentials",
  //           authFlag: false,
  //           owsGetDetail: [],
  //         });
  //       }
  //     })
  //     .catch((e) => {
  //       this.setState({
  //         error: "Please enter correct credentials" + e,
  //         owsGetDetail: [],
  //       });
  //     });
  // }

  calculateMemberSpecificTable() {
    let memberlist = [];
    if (this.props.groupMemberName.length > 0) {
      this.setState({
        memberWithAmountList: [],
      });
      this.props.groupMemberName.map((memberName) => {
        let sum = 0;
        let sumOws = 0;
        let memberDetail = this.props.owsGetDetail.filter(
          (x) => x.MemberGets == memberName.Email
        );
        if (memberDetail.length > 0) {
          memberDetail.map((member) => {
            sum = sum + member.Amount;
          });
        }
        let memberOws = this.props.owsGetDetail.filter(
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
        let user = {
          Name: memberName.Name,
          Amount: sum + sumOws,
          UserProfilePic: memberName.UserProfilePic,
        };
        memberlist.push(user);
      });
      this.setState({
        memberWithAmountList: memberlist,
      });
    }
  }

  render() {
    let component = null;
    console.log(JSON.stringify(this.state.memberWithAmountList));
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
              {detail.Amount} <br />
            </p>
          </div>
        );
      } else {
        let display = "";
        if (detail.Amount == 0) {
          console.log("Came here " + detail.Amount);
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
              Ows {this.state.Currency} {detail.Amount}
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

const mapStateToProps = (state) => {
  return {
    owsGetDetail: state.groupOwsGetsDetail.owsGetDetail,
    groupMemberName: state.groupOwsGetsDetail.groupMemberName,
  };
};

export default connect(mapStateToProps, { getGroupSummary })(OwsGetDetail);
