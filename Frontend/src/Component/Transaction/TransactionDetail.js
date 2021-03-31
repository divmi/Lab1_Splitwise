import React, { Component } from "react";
import { transactionDetail } from "../../actions/transaction";
import { connect } from "react-redux";
import Pagination from "./Pagination";
import Posts from "./Posts";
//import PropTypes from "prop-types";

class TransactionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortbyGroup: "",
      showTransactionBasedOnFilter: [],
      currentPage: 1,
      postsPerPage: 2,
      ID: "",
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
    this.props.transactionDetail(localStorageData._id);
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

  onPageSelected = (e) => {
    this.setState({
      currentPage: 1,
      postsPerPage: e.target.value,
    });
  };

  render() {
    // let showTransaction = null;
    let showGroupName = null;
    const {
      currentPage,
      postsPerPage,
      showTransactionBasedOnFilter,
    } = this.state;
    console.log(showTransactionBasedOnFilter.length);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = showTransactionBasedOnFilter.slice(
      indexOfFirstPost,
      indexOfLastPost
    );

    const paginate = (pageNum) => this.setState({ currentPage: pageNum });

    const nextPage = () => this.setState({ currentPage: currentPage + 1 });

    const prevPage = () => this.setState({ currentPage: currentPage - 1 });

    if (this.props.groupName != null && this.props.groupName.length > 0) {
      showGroupName = this.props.groupName.map((name, idx) => {
        return (
          <option key={idx} value={name}>
            {name}
          </option>
        );
      });
    }

    return (
      <div className="container-fluid">
        <div className="row rounded">
          <div className="col-col-3">
            <label style={{ fontWeight: "bold", fontSize: "25px" }}>
              Recent activity
            </label>
          </div>
          <div className="col-col-6 offset-2">
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
          <div className="col-col-3" style={{ marginLeft: "4px" }}>
            <select className="form-control" onChange={this.onPageSelected}>
              <option value="">Page Size</option>
              <option value="2">2</option>
              <option value="5">5</option>
              <option value="10">10</option>
            </select>
          </div>
        </div>
        <div className="row shadow p-2 bg-light rounded">
          <Posts posts={currentPosts} />
        </div>
        <div className="row">
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={showTransactionBasedOnFilter.length}
            paginate={paginate}
            nextPage={nextPage}
            prevPage={prevPage}
          />
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
