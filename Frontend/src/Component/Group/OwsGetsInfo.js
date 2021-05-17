import React, { Component } from "react";
import { getOwsGetsDetail, getMemberName } from "../../query/query";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";

class OwsGetDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      componentMounted: false,
      memberWithAmountList: [],
      owsGetDetail: [],
      Currency: ""
    };
  }

  componentDidMount() {
    console.log("Componnet Mounted");
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        const localStorageData = JSON.parse(localStorage.getItem("userData"));
        this.setState({
          Currency: localStorageData.Currency
        });
      }
    }
    //this.props.getGroupSummary(this.props.name);
  }

  componentDidUpdate(prevState) {
    if (prevState.data.owsGetDetail !== this.props.data.owsGetDetail) {
      graphql(getMemberName, {
        options: props => ({ variables: { _id: props.name } })
      });
      this.setState({
        owsGetDetail: this.props.data.owsGetDetail
      });
      if (prevState.data != this.props.data) {
        console.log(this.props.data);
      }
      if (prevState.data.groupMemberName !== this.props.data.groupMemberName) {
        this.calculateMemberSpecificTable();
      }
    }
  }

  calculateMemberSpecificTable() {
    let memberlist = [];
    if (this.props.data.groupMemberName.length > 0) {
      this.setState({
        memberWithAmountList: []
      });
      this.props.data.groupMemberName.map(memberName => {
        let sum = 0;
        let sumOws = 0;
        let memberDetail = this.props.data.owsGetDetail.filter(
          x => x.MemberGets == memberName.ID._id
        );
        if (memberDetail.length > 0) {
          memberDetail.map(member => {
            sum = sum + member.Amount;
          });
        }
        let memberOws = this.props.owsGetDetail.filter(
          x => x.MemberOws == memberName._id
        );
        if (memberOws.length > 0) {
          memberOws.map(member => {
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
          UserProfilePic: memberName.ID.UserProfilePic
        };
        memberlist.push(user);
      });
      this.setState({
        memberWithAmountList: memberlist
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

export default compose(
  graphql(getOwsGetsDetail, {
    options: props => ({ variables: { _id: props.name } })
  })
)(OwsGetDetail);
