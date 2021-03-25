import React, { Component } from "react";
import { transactionDetail } from "../../actions/transaction";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

class TransactionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortbyGroup: "",
      showTransactionBasedOnFilter: [],
    };
  }

  // getTransactionDetail() {
  //   axios
  //     .get(`http://${config.ipAddress}:8000/getTransactionFromUser`, {
  //       params: {
  //         email: this.props.email,
  //       },
  //     })
  //     .then((response) => {
  //       if (response.status === 200) {
  //         console.log("All user:" + response.data);
  //         this.setState(() => ({
  //           transactionDetail: [response.data],
  //         }));
  //         this.setState({
  //           showTransactionBasedOnFilter: this.state.transactionDetail[0],
  //         });
  //         this.setState({
  //           groupName: this.state.transactionDetail[0].map(
  //             (groupName) => groupName.GroupName
  //           ),
  //         });
  //         console.log("Group info" + this.state.transactionDetail.length);
  //       } else {
  //         this.setState({
  //           error: "Please enter correct credentials",
  //           authFlag: false,
  //         });
  //       }
  //     })
  //     .catch((e) => {
  //       this.setState({
  //         error: "Please enter correct credentials" + e,
  //       });
  //     });
  // }

  componentDidMount() {
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        const localStorageData = JSON.parse(localStorage.getItem("userData"));
        this.setState({
          Currency: localStorageData.Currency,
        });
      }
    }
    if (this.props.transaction.length == 0) {
      this.props.transactionDetail(this.props.email);
    }
    console.log(this.props.transaction);
    this.setState({
      showTransactionBasedOnFilter: this.props.transaction,
    });
  }

  componentDidUpdate(prevState) {
    if (prevState.transaction != this.props.transaction) {
      console.log("Componnet did update");
      this.setState({
        showTransactionBasedOnFilter: this.props.transaction,
      });
    }
  }

  OnSortByAscOrDesc = (e) => {
    console.log(e.target.value);
    if (e.target.value == "Ascending") {
      this.setState({
        showTransactionBasedOnFilter: this.state.showTransactionBasedOnFilter.sort(
          function (a, b) {
            return new Date(a.Time) - new Date(b.Time);
          }
        ),
      });
    } else if (e.target.value == "Decending") {
      this.setState({
        showTransactionBasedOnFilter: this.state.showTransactionBasedOnFilter.sort(
          function (a, b) {
            return new Date(b.Time) - new Date(a.Time);
          }
        ),
      });
    }
  };

  OnGroupSelect = (e) => {
    if (this.props.transaction != null && this.props.transaction.length > 0) {
      if (e.target.value != "") {
        const filterTransOnGroup = this.props.transaction.filter(
          (x) => x.GroupName == e.target.value
        );
        this.setState({
          showTransactionBasedOnFilter: filterTransOnGroup,
        });
      } else {
        this.setState({
          showTransactionBasedOnFilter: this.props.transaction,
        });
      }
    } else {
      this.setState({
        showTransactionBasedOnFilter: this.props.transaction,
      });
    }
    console.log(e.target.value);
  };

  render() {
    let showTransaction = null;
    let showGroupName = null;
    if (
      this.state.showTransactionBasedOnFilter != null &&
      this.state.showTransactionBasedOnFilter.length > 0
    ) {
      showTransaction = this.state.showTransactionBasedOnFilter.map(
        (name, idx) => {
          if (name.TransactionDetail == "SettleUp") {
            return (
              <tr key={idx} style={{ verticalAlign: "center" }}>
                <td style={{ color: "GrayText" }}>
                  {new Date(name.Time).toLocaleString("en-us", {
                    weekday: "long",
                  })}
                </td>
                <td>
                  <i className="greenCode fas fa-receipt fa-2x"></i>
                  <strong> {name.Name}</strong> is
                  <strong> settled Up</strong> with
                  <strong> {name.SettleUpWith}</strong>
                </td>
                <td>
                  <label>{this.props.Currency} </label>
                  <label> {name.Amount}</label>
                </td>
              </tr>
            );
          } else {
            return (
              <tr key={idx} style={{ verticalAlign: "center" }}>
                <td style={{ color: "GrayText" }}>
                  {new Date(name.Time).toLocaleString("en-us", {
                    weekday: "long",
                  })}
                </td>
                <td>
                  <i className="greenCode fas fa-receipt fa-2x"></i>
                  <strong> {name.Name}</strong> added
                  <strong> {name.TransactionDetail} </strong>
                  in <strong>{name.GroupName}</strong>
                </td>
                <td>
                  <label>{this.props.Currency} </label>
                  <label> {name.Amount}</label>
                </td>
              </tr>
            );
          }
        }
      );
      if (this.props.groupName != null && this.props.groupName.length > 0) {
        const groups = [...new Set(this.props.groupName)];
        showGroupName = groups.map((name, idx) => {
          return (
            <option key={idx} value={name}>
              {name}
            </option>
          );
        });
      }
    } else {
      showTransaction = (
        <tr>
          <td>
            <img src="./assets/transaction.png" height={300} width={300}></img>
            <h3>
              You have not added any expenses yet
              <i className="fas fa-frown"></i>
            </h3>
          </td>
        </tr>
      );
    }
    return (
      <div className="container-fluid">
        <div className="row rounded">
          <div className="col-col-3">
            <label style={{ fontWeight: "bold", fontSize: "25px" }}>
              Recent activity
            </label>
          </div>
          <div className="col-col-6 offset-3">
            <select
              className="form-control"
              width={80}
              onChange={this.OnGroupSelect}
            >
              <option value="">Sort by Group</option>
              {showGroupName}
            </select>
          </div>
          <div className="col-col-3" style={{ marginLeft: "4px" }}>
            <select className="form-control" onChange={this.OnSortByAscOrDesc}>
              <option value="">Sort by Time</option>
              <option value="Ascending">Ascending</option>
              <option value="Decending">Decending</option>
            </select>
          </div>
        </div>
        <div className="row shadow p-3 mb-5 bg-light rounded">
          <table className="table">
            <tbody>{showTransaction}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    transaction: state.transaction.transaction,
    groupName: state.transaction.groupName,
    Currency: state.login.Currency,
  };
};

export default connect(mapStateToProps, { transactionDetail })(
  TransactionDetail
);
