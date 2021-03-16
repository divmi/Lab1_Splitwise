import {
  Button,
  Row,
  Dropdown,
  Col,
  Image,
  Modal,
  Container,
  Form,
} from "react-bootstrap";
import React, { Component } from "react";
import axios from "axios";
import cookie from "react-cookies";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owsgetsDetail: [],
      isOpen: false,
      show: [],
      Name: "",
      Amount: 0,
      anchorEl: null,
      userSpecificInfo: [],
      memberWithAmountList: [],
      Currency: "",
      Email: "",
    };
  }

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => {
    this.setState({ isOpen: false });
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  alertClicked = (detail) => {
    this.setState({
      Name: detail.MemberName,
      Amount: detail.Amount,
    });
  };
  calculateOwsGetsBasedOnDataReceived() {
    let sumOws = 0;
    let sumGets = 0;
    console.log(this.props.email);
    if (this.state.owsgetsDetail.length > 0) {
      this.state.owsgetsDetail[0].map((value) => {
        if (value.MemberOws == this.props.email) {
          this.state.show.push({
            MemberGets: value.MemberOws,
            MemberOws: value.MemberGets,
            Amount: -value.Amount,
            GroupName: value.GroupName,
          });
        } else {
          this.state.show.push(value);
        }
      });
      this.calculateMemberSpecificTable();
      this.state.show.map((detail) => {
        console.log(detail.Amount);
        if (detail.Amount > 0) {
          console.log(sumGets);
          sumGets += detail.Amount;
        } else {
          console.log(sumOws);
          sumOws += detail.Amount;
        }
        this.setState({
          ows: sumOws,
          gets: sumGets,
          total: sumGets + sumOws,
        });
      });
    }
  }

  calculateMemberSpecificTable() {
    this.setState({
      userSpecificInfo: this.state.show.map(
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
          Transaction: allTransaction,
        });
      });
      console.log(JSON.stringify(this.state.memberWithAmountList));
    }
  }
  handleSettleUp = (e) => {
    //prevent page from refresh
    e.preventDefault();
    const data = {
      settleUpWith: this.state.Name,
      Amount: this.state.Amount,
      MemberName: this.props.email,
    };
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/settleUp", data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          this.closeModal();
          this.setState({
            show: [],
          });
          this.getUserSpecificTransactionDetail();
        } else {
          this.setState({
            loginError:
              "<p style={{color: red}}>User is already registered</p>",
            authFlag: false,
          });
        }
      })
      .catch(() => {
        this.setState({
          loginError: "User is already registered",
        });
      });
  };

  getUserSpecificTransactionDetail() {
    axios
      .get("http://localhost:8000/getUserSpecificGetOwsInfo", {
        params: {
          email: cookie.load("cookie").Email,
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
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        const localStorageData = JSON.parse(localStorage.getItem("userData"));
        this.setState({
          Currency: localStorageData.Currency,
          Email: localStorageData.Email,
        });
      }
    }
  }

  render() {
    let componentOws = null;
    let componentGets = null;
    let memberOwList = [];
    let sumOws = 0,
      sumGets = 0,
      total = 0;
    this.state.memberWithAmountList.map((detail) => {
      if (detail.Amount < 0) {
        sumOws += detail.Amount;
      } else {
        sumGets += detail.Amount;
      }
    });
    total = sumGets + sumOws;
    componentOws = this.state.memberWithAmountList.map((detail, idx) => {
      if (detail.Amount < 0) {
        memberOwList.push(detail);
        return (
          <div key={idx} className="container orangeCode">
            <p style={{ fontSize: "14px" }}>
              {detail.MemberName} <br />
              you ows {this.state.Currency}
              {detail.Amount} <br />
              {detail.Transaction.map((value, idy) => {
                if (value.Amount < 0) {
                  return (
                    <label className="dashBoardLabel" key={idy}>
                      o: you owe{" "}
                      <strong className="orangeCode">
                        {this.state.Currency}
                        {-value.Amount.toFixed(2)}
                      </strong>{" "}
                      for {value.GroupName}
                    </label>
                  );
                } else {
                  return (
                    <label key={idy} className="dashBoardLabel">
                      o: owes you{" "}
                      <strong className="greenCode">
                        {" "}
                        {this.state.Currency}
                        {value.Amount.toFixed(2)}
                      </strong>{" "}
                      for {value.GroupName}
                    </label>
                  );
                }
              })}
            </p>
          </div>
        );
      }
    });
    componentGets = this.state.memberWithAmountList.map((detail, idx) => {
      if (detail.Amount > 0) {
        return (
          <div key={idx} className="container greenCode">
            <p style={{ fontSize: "14px" }}>
              {detail.MemberName}
              <br /> owes you {this.state.Currency}
              {detail.Amount} <br />
              {detail.Transaction.map((value, idy) => {
                if (value.Amount < 0) {
                  return (
                    <label className="dashBoardLabel" key={idy}>
                      o: you owe{" "}
                      <strong className="orangeCode">
                        {this.state.Currency}
                        {-value.Amount.toFixed(2)}
                      </strong>{" "}
                      for {value.GroupName}
                    </label>
                  );
                } else {
                  return (
                    <label key={idy} className="dashBoardLabel">
                      o: owes you{" "}
                      <strong className="greenCode">
                        {" "}
                        {this.state.Currency}
                        {value.Amount.toFixed(2)}
                      </strong>{" "}
                      for {value.GroupName}
                    </label>
                  );
                }
              })}
            </p>
          </div>
        );
      }
    });
    console.log("Divya : " + JSON.stringify(memberOwList));
    const popover = memberOwList.map((detail, idx) => {
      return (
        <Dropdown.Item
          key={idx}
          action
          onClick={() => this.alertClicked(detail)}
        >
          {detail.MemberName}
        </Dropdown.Item>
      );
    });
    return (
      <div className="container">
        <div className="row shadow mb-6 bg-grey rounded" style={{ padding: 0 }}>
          <div className="col col-sm-8 border-bottom p-3">
            <label className="md-1">
              <h3 style={{ marginTop: "10px", marginLeft: "20px" }}>
                <strong>DashBoard</strong>
              </h3>
            </label>
          </div>
          <div className="col col-sm-4 border-bottom p-3">
            <Button
              className="btn btn-Normal"
              style={{
                alignSelf: "center",
                alignContent: "center",
              }}
              type="button"
              onClick={this.openModal}
            >
              Settle Up
            </Button>
          </div>
        </div>
        <div
          className="row border-bottom shadow bg-white"
          style={{ padding: 0 }}
        >
          <div
            className="col col-sm-4 p-2 border-right"
            style={{ textAlign: "center" }}
          >
            <label style={{ marginRight: "3px" }}>total balance: </label>
            <label
              style={total < 0 ? { color: "orange" } : { color: "#5bc5a7" }}
            >
              {this.state.Currency}
              {total.toFixed(2)}
            </label>
          </div>
          <div
            className="col col-sm-4 border-right"
            style={{ textAlign: "center", marginTop: "10px" }}
          >
            <label>you owe: </label>
            <label className="orangeCode" style={{ marginLeft: "3px" }}>
              {this.state.Currency}
              {sumOws.toFixed(2)}
            </label>
          </div>
          <div
            className="col col-sm-4"
            style={{ textAlign: "center", marginTop: "10px" }}
          >
            <label>you are owed: </label>
            <label className="greenCode" style={{ marginLeft: "3px" }}>
              {this.state.Currency}
              {sumGets.toFixed(2)}
            </label>
          </div>
        </div>
        <div className="row top-buffer shadow p-5 mb-8 bg-white rounded">
          <div className="col col-sm-6"> {componentOws}</div>
          <div className="col col-sm-6"> {componentGets}</div>
          {/* <table>
            <thead>
              <tr>
                <td>
                  <label>Details:</label>
                </td>
              </tr>
            </thead>
            <tbody>{component}</tbody>
          </table> */}
        </div>
        <Modal show={this.state.isOpen} onHide={this.closeModal}>
          <Modal.Header className="custom-header" closeButton>
            <Modal.Title style={{ marginLeft: "10px" }}>Settle Up</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <label style={{ alignSelf: "center", marginRight: 20 }}>
                  With you and{" "}
                </label>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="light"
                    width={40}
                    height={30}
                    id="dropdown-basic"
                  >
                    Settle Up With
                  </Dropdown.Toggle>

                  <Dropdown.Menu>{popover}</Dropdown.Menu>
                </Dropdown>
              </Row>
              <hr></hr>
              <Row>
                <Col xs={6} md={4}>
                  <Image
                    width={150}
                    height={100}
                    src="./assets/Bill.png"
                    rounded
                  />
                </Col>
                <Col xs={6} md={6}>
                  <Form.Group>
                    <Form.Control
                      style={{
                        borderStyle: "dotted",
                        borderRadius: 1,
                      }}
                      type="text"
                      value={this.state.Name}
                      readOnly
                      placeholder="Person to settle up with"
                      required
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
                      style={{
                        borderStyle: "dotted",
                        borderRadius: 1,
                      }}
                      type="number"
                      step="0.1"
                      min="0"
                      value={-this.state.Amount}
                      readOnly
                      placeholder={this.state.Currency + " 0.00"}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeModal}>
              Close
            </Button>
            <Button
              variant="btn btn-green"
              style={{ background: "#f07343" }}
              type="submit"
              onClick={this.handleSettleUp}
            >
              Settle Up
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Dashboard;
