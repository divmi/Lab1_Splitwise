import React, { Component } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { transactionDetail } from "../../actions/transaction";
import { connect } from "react-redux";

export class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionData: [],
      ID: "",
      page: 0,
    };
  }
  componentDidMount() {
    let localStorageData = {};
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        localStorageData = JSON.parse(localStorage.getItem("userData"));
        this.setState({
          ID: localStorageData._id,
        });
      }
    }
  }

  PageSizeChange = (e) => {
    console.log(e);
    this.setState({
      page: 0,
    });
    this.props.transactionDetail(this.state.ID, 0, e.pageSize);
  };

  PageChange = (e) => {
    console.log(e.page);
    this.setState({
      page: e.page,
    });
    this.props.transactionDetail(this.state.ID, e.page, e.pageSize);
  };

  render() {
    const { posts } = this.props;
    // let showTransaction = null;
    let transaction = [];
    const columns = [
      {
        field: "id",
        width: 5,
        renderCell: (param) => (
          <label style={{ visibility: "hidden" }}>{param.value}</label>
        ),
      },
      {
        field: "Date",
        headerName: "Date",
        type: "date",
        width: 150,
        renderCell: (param) => (
          <label style={{ color: "Gray", fontWeight: "bold" }}>
            {param.value}
          </label>
        ),
      },
      {
        field: "Detail",
        headerName: "Transaction Detail",
        width: 520,
        renderCell: (param) => (
          <label style={{ fontWeight: "bold", textAlign: "center" }}>
            <i className="greenCode fas fa-receipt fa-3x p-2"></i>
            {param.value}
          </label>
        ),
      },
      { field: "Amount", headerName: "", width: 150 },
    ];
    if (posts != null && posts.length > 0) {
      posts.map((name, idx) => {
        if (name.TransactionDetail == "SettleUp") {
          transaction.push({
            id: idx,
            Date: new Date(name.Time).toLocaleString("en-us", {
              weekday: "long",
            }),
            Detail:
              name.MemberID.Name + "is settled Up with" + name.SettleUpWith,
            Amount: this.props.Currency + name.Amount,
          });
        } else {
          transaction.push({
            id: idx,
            Date: new Date(name.Time).toLocaleString("en-us", {
              weekday: "long",
            }),
            Detail:
              name.MemberID.Name +
              " added " +
              name.TransactionDetail +
              " in " +
              name.GroupID.GroupName,
            Amount: this.props.Currency + name.Amount,
          });
        }
      });
    }

    return (
      <div className="container">
        <div
          style={{
            height: 600,
            width: "100%",
            alignContent: "center",
            textAlign: "center",
          }}
        >
          <DataGrid
            rows={transaction}
            rowsPerPageOptions={[2, 5, 10]}
            columns={columns}
            pageSize={2}
            rowHeight={60}
            paginationMode="server"
            page={this.state.page}
            rowCount={this.props.count}
            onPageSizeChange={this.PageSizeChange}
            onPageChange={this.PageChange}
            headerHeight={1}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    count: state.transaction.count,
  };
};

export default connect(mapStateToProps, { transactionDetail })(Posts);
