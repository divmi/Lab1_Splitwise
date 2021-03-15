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
          this.calculateMemberSpecificTable();
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
    this.setState({
      userSpecificInfo: this.state.owsGetDetail.map(
        (memberName) => memberName.MemberOws
      ),
    });
    const memberInfo = [...new Set(this.state.userSpecificInfo)];
    if (memberInfo.length > 0) {
      memberInfo.map((memberName) => {
        let finalMoney = 0;
        const allTransaction = this.state.show.filter(
          (x) => x.MemberOws == memberName
        );
        allTransaction.map((x) => {
          finalMoney += x.Amount;
        });
        this.state.memberWithAmountList.push({
          MemberName: memberName,
          Amount: finalMoney,
          Transaction: {
            transaction: allTransaction,
          },
        });
      });
      console.log(JSON.stringify(this.state.memberWithAmountList));
    }
  }

  render() {
    let component = null;
    component = this.state.memberWithAmountList.map((name, idx) => {
      return (
        <tr key={idx}>
          <td>{name.MemberName}</td>
        </tr>
      );
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
