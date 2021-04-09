import React, { Component } from "react";
import { connect } from "react-redux";
import { getGroupSummary } from "../../actions/GroupOwsGetsInfo";

class OwsGetDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      componentMounted: false,
      memberWithAmountList: [],
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
    } else if (prevState.owsGetDetail !== this.props.owsGetDetail) {
      this.calculateMemberSpecificTable();
    } else if (prevState.transactionDetail !== this.props.transactionDetail) {
      this.props.getGroupSummary(this.props.name);
    }
  }

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
          (x) => x.MemberGets == memberName.ID._id
        );
        if (memberDetail.length > 0) {
          memberDetail.map((member) => {
            sum = sum + member.Amount;
          });
        }
        let memberOws = this.props.owsGetDetail.filter(
          (x) => x.MemberOws == memberName.ID._id
        );
        if (memberOws.length > 0) {
          memberOws.map((member) => {
            sumOws = sumOws + -member.Amount;
          });
        }
        if (
          memberName.ID.UserProfilePic == "" ||
          memberName.ID.UserProfilePic == null
        ) {
          memberName.ID.UserProfilePic = "./assets/userIcon.png";
        }
        let user = {
          Name: memberName.ID.Name,
          Amount: sum + sumOws,
          UserProfilePic: memberName.ID.UserProfilePic,
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
              {detail.Amount.toFixed(2)} <br />
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

const mapStateToProps = (state) => {
  return {
    owsGetDetail: state.groupOwsGetsDetail.owsGetDetail,
    transactionDetail: state.groupInfo.transactionDetail,
  };
};

export default connect(mapStateToProps, { getGroupSummary })(OwsGetDetail);
