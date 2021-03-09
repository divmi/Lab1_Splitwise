import React, { Component } from "react";
import axios from "axios";

class TransactionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionDetail: [],
    };
  }

  getTransactionDetail() {
    axios
      .get("http://localhost:8000/getTransactionFromUser", {
        params: {
          email: this.props.email,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("All user:" + response.data);
          this.setState(() => ({
            transactionDetail: [response.data],
          }));
          console.log("Group info" + this.state.transactionDetail.length);
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

  componentDidMount() {
    this.setState({
      transactionDetail: this.getTransactionDetail(),
    });
  }

  render() {
    let showTransaction = null;
    if (
      this.state.transactionDetail != null &&
      this.state.transactionDetail.length > 0 &&
      this.state.transactionDetail[0].length > 0
    ) {
      console.log("Came inside");
      showTransaction = this.state.transactionDetail[0].map((name, idx) => {
        return (
          <tr key={idx} style={{ verticalAlign: "center" }}>
            <td>
              <strong>{name.Name}</strong> added
              <strong> {name.TransactionDetail} </strong>
              in <strong>{name.GroupName}</strong>
            </td>
            <td>
              {name.Currency}
              {name.Amount}
            </td>
          </tr>
        );
      });
    } else {
      showTransaction = (
        <tr>
          <img src="./assets/shopping.jpg" height={300} width={300}></img>
          <h3>
            You have not added any expenses yet <i className="fas fa-frown"></i>
          </h3>

          <h5>Click on Add Expense button to start</h5>
        </tr>
      );
    }
    return (
      <div className="container-fluid">
        <div className="row"></div>
        <div className="row shadow p-3 mb-5 bg-light rounded">
          <table className="table">
            <tbody>{showTransaction}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default TransactionDetail;
