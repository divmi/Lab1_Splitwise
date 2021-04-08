import React, { Component } from "react";
import { transactionDetail } from "../../actions/transaction";
import { connect } from "react-redux";
//import Pagination from "./Pagination";
import Posts from "./Posts";

class TransactionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortbyGroup: "",
      showTransactionBasedOnFilter: [],
      ID: "",
      Currency: "",
    };
  }

  componentDidMount() {
    let localStorageData = {};
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        localStorageData = JSON.parse(localStorage.getItem("userData"));
        this.setState({
          Currency: localStorageData.Currency,
          ID: localStorageData._id,
        });
      }
    }
    this.props.transactionDetail(localStorageData._id, 0, 2);
  }

  componentDidUpdate(prevState) {
    if (prevState.transaction != this.props.transaction) {
      console.log("Componnet did update");
      this.setState({
        showTransactionBasedOnFilter: this.props.transaction,
      });
      this.setState({
        pageLoadInProgress: false,
      });
    }
  }

  OnGroupSelect = (e) => {
    if (this.props.transaction != null && this.props.transaction.length > 0) {
      if (e.target.value != "") {
        const filterTransOnGroup = this.props.transaction.filter(
          (x) => x.GroupID.GroupName == e.target.value
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
    let showGroupName = null;
    if (this.props.groupName != null && this.props.groupName.length > 0) {
      showGroupName = this.props.groupName.map((name, idx) => {
        return (
          <option key={idx} value={name}>
            {name}
          </option>
        );
      });
    }
    if (this.state.pageLoadInProgress) {
      return <div className="container spinner-border text-text-muted"></div>;
    } else {
      return (
        <div className="container-fluid">
          <div className="row rounded bg-light">
            <div className="col-col-3">
              <label
                style={{
                  fontWeight: "bold",
                  fontSize: "25px",
                  marginLeft: "30px",
                }}
              >
                Recent activity
              </label>
            </div>
            <div className="col-col-6 offset-7">
              <select
                className="form-control"
                width={80}
                onChange={this.OnGroupSelect}
              >
                <option value="">Sort by Group</option>
                {showGroupName}
              </select>
            </div>
          </div>
          <div className="row shadow p-1 bg-light rounded">
            <Posts
              posts={this.state.showTransactionBasedOnFilter}
              Currency={this.state.Currency}
            />
          </div>
        </div>
      );
    }
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
