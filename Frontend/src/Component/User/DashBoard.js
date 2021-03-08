import { Button } from "react-bootstrap";
import React, { Component } from "react";
import axios from "axios";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owsgetsDetail: [],
      ows: 0,
      gets: 0,
      total: 0,
    };
  }

  calculateOwsGetsBasedOnDataReceived() {
    let sumOws = 0;
    let sumGets = 0;
    let show = [];
    if (this.state.owsgetsDetail.length > 0)
      this.state.owsgetsDetail[0].map((value) => {
        if (value.Amount < 0) {
          show.push({
            MemberOws: value.MemberGets,
            MemberGets: value.MemberOws,
            Amount: -value.Amount,
          });
        } else {
          show.push(value);
        }
      });
    show.map((detail) => {
      if (detail.MemberGets == this.props.email) {
        sumGets += detail.Amount;
      } else {
        sumOws += detail.Amount;
      }
      this.setState({
        ows: sumOws,
        gets: sumGets,
        total: sumGets - sumOws,
      });
    });
    console.log(sumOws);
    console.log(sumGets);
  }

  getUserSpecificTransactionDetail() {
    axios
      .get("http://localhost:8000/getUserSpecificGetOwsInfo", {
        params: {
          email: this.props.email,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("All user:" + response.data);
          this.setState(() => ({
            owsgetsDetail: [response.data],
          }));
          this.calculateOwsGetsBasedOnDataReceived();
          console.log(
            "Divya : Ows Gets Detail" + JSON.stringify(this.state.owsgetsDetail)
          );
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
    console.log("Control received in component did mount");
    this.getUserSpecificTransactionDetail();
  }

  render() {
    return (
      <div className="container">
        <div
          className="row shadow p-5 mb-6 bg-white rounded"
          style={{ padding: 0 }}
        >
          <div className="col col-sm-8 border-bottom">
            <label>
              <h3>
                <strong>DashBoard</strong>
              </h3>
            </label>
          </div>
          <div className="col col-sm-4 border-bottom">
            <Button
              className="btn btn-Normal"
              style={{
                alignSelf: "center",
                height: 45,
                alignContent: "center",
              }}
              type="button"
            >
              Settle Up
            </Button>
          </div>
          <div className="row border-bottom" style={{ padding: 0 }}>
            <div className="col col-sm-4 border-right">
              <label>total balance</label>
              <label
                style={
                  this.state.total < 0
                    ? { color: "orange" }
                    : { color: "#5bc5a7" }
                }
              >
                {this.state.total.toFixed(2)}
              </label>
            </div>
            <div className="col col-sm-3 border-right">
              <label>you owe</label>
              <label style={{ color: "orange" }}>
                {this.state.ows.toFixed(2)}
              </label>
            </div>
            <div className="col col-sm-4 border-right">
              <label>you are owed</label>
              <label style={{ color: "#5bc5a7" }}>
                {this.state.gets.toFixed(2)}
              </label>
            </div>
          </div>
        </div>

        <div className="row top-buffer shadow p-5 mb-8 bg-white rounded"></div>
      </div>
    );
  }
}

export default Dashboard;
