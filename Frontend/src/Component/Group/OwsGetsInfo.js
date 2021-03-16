import React, { Component } from "react";
import axios from "axios";
//import cookie from "react-cookies";
class OwsGetDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owsGetDetail: [],
      componentMounted: false,
      memberWithAmountList: [],
      groupMemberName: [],
    };
  }

  componentDidMount() {
    console.log("compoment mounted");
    this.getGroupSummary();
    console.log(JSON.stringify(this.state.owsGetDetail));
  }

  componentDidUpdate(prevState) {
    if (prevState.name != this.props.name) {
      this.getGroupSummary();
    }
  }

  GroupMemberName() {
    console.log("Group Name :" + this.props.name);
    axios
      .get("http://localhost:8000/getGroupMemberName", {
        params: {
          groupName: this.props.name,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("All user:" + response.data);
          this.setState({
            groupMemberName: response.data,
          });
          this.calculateMemberSpecificTable();
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
  }
  getGroupSummary() {
    axios
      .get("http://localhost:8000/getGroupSummary", {
        params: {
          groupName: this.props.name,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Ows get detail:" + JSON.stringify(response.data));
          this.setState({
            owsGetDetail: response.data,
          });
          this.GroupMemberName();
          console.log(
            "got data for transaction" + JSON.stringify(this.state.owsGetDetail)
          );
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
      console.log(JSON.stringify(this.state.groupMemberName));
      let memberWithAmountListBackup = [...this.state.memberWithAmountList];
      this.state.groupMemberName.map((memberName) => {
        let sum = 0;
        let memberDetail = this.state.owsGetDetail.filter(
          (x) =>
            x.MemberOws == memberName.Email || x.MemberGets == memberName.Email
        );
        if (memberDetail.length > 0) {
          memberDetail.map((member) => {
            sum = sum + member.Amount;
          });
          let item = {
            ...memberWithAmountListBackup[
              memberWithAmountListBackup.length - 1
            ],
            MemberName: memberName.Name,
            Amount: sum,
          };
          memberWithAmountListBackup[
            memberWithAmountListBackup.length - 1
          ] = item;
          this.setState({
            memberWithAmountList: memberWithAmountListBackup,
          });
          // this.setState(...prevState.memberWithAmountList, {
          //   MemberName: memberName.Name,
          //   Amount: sum,
          // });
        }
      });
    }
  }

  render() {
    let component = null;
    component = this.state.memberWithAmountList.map((detail, idx) => {
      if (detail.Amount < 0) {
        return (
          <div key={idx} className="container orangeCode">
            <img
              src={detail.UserProfilePic}
              width={30}
              height={30}
              className="rounded-circle"
            ></img>
            <p style={{ fontSize: "14px" }}>
              {detail.Name} <br />
              ows {this.state.Currency}
              {detail.Amount} <br />
            </p>
          </div>
        );
      } else {
        return (
          <div key={idx} className="container greenCode">
            <img
              src={detail.UserProfilePic}
              width={30}
              height={30}
              className="rounded-circle"
            ></img>
            <p style={{ fontSize: "14px" }}>
              {detail.Name} <br />
              gets {this.state.Currency}
              {detail.Amount} <br />
            </p>
          </div>
        );
      }
    });
    return (
      <div className="container">
        <div>
          <table>
            <tbody>{component}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default OwsGetDetail;
