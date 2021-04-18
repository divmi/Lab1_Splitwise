import {
  Button,
  Row,
  Dropdown,
  Col,
  Image,
  Modal,
  Container,
  Form
} from "react-bootstrap";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getUserSpecificTransactionDetail,
  settleUp
} from "../../actions/dashboardAction";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      show: [],
      Amount: 0,
      anchorEl: null,
      memberWithAmountList: [],
      Currency: "",
      ID: "",
      GroupName: "",
      GroupID: "",
      RealName: "",
      error: "",
      MemberOws: ""
    };
  }

  openModal = () =>
    this.setState({
      error: "",
      RealName: "",
      Amount: 0,
      isOpen: true
    });
  closeModal = () => {
    this.setState({ isOpen: false });
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  alertClicked = detail => {
    console.log("GroupName Divya------------------:" + JSON.stringify(detail));
    this.setState({
      Amount: detail.Amount,
      GroupName: detail.GroupID,
      RealName: detail.MemberOwsName,
      MemberOws: detail.MemberOws,
      GroupID: detail.Transaction[0].GroupID
    });
    console.log(this.state.RealName);
  };
  calculateOwsGetsBasedOnDataReceived() {
    let sumOws = 0;
    let sumGets = 0;
    this.setState({
      show: []
    });
    if (this.props.userAmountDetails.length > 0) {
      this.props.userAmountDetails.map(value => {
        if (value.MemberOws._id == this.state.ID) {
          this.state.show.push({
            MemberGets: value.MemberOws._id,
            MemberOws: value.MemberGets._id,
            Amount: -value.Amount,
            GroupName: value.GroupID.GroupName,
            MemberGetsName: value.MemberOws.Name,
            MemberOwsName: value.MemberGets.Name,
            MemberProfilePicOws: value.MemberGets.UserProfilePic,
            MemberProfilePicGets: value.MemberOws.UserProfilePic,
            GroupID: value.GroupID._id
          });
        } else {
          this.state.show.push({
            MemberGets: value.MemberGets._id,
            MemberOws: value.MemberOws._id,
            Amount: value.Amount,
            GroupName: value.GroupID.GroupName,
            MemberGetsName: value.MemberGets.Name,
            MemberOwsName: value.MemberOws.Name,
            MemberProfilePicOws: value.MemberOws.UserProfilePic,
            MemberProfilePicGets: value.MemberGets.UserProfilePic,
            GroupID: value.GroupID._id
          });
        }
      });
      console.log(JSON.stringify(this.state.show));
      this.calculateMemberSpecificTable();
      this.state.show.map(detail => {
        if (detail.Amount > 0) {
          sumGets += detail.Amount;
        } else {
          sumOws += detail.Amount;
        }
        this.setState({
          ows: sumOws,
          gets: sumGets,
          total: sumGets + sumOws
        });
      });
    }
  }

  calculateMemberSpecificTable() {
    this.setState({
      memberWithAmountList: []
    });
    let memberWithOwsGetsDetail = [];
    const memberInfo = [
      ...new Set(this.state.show.map(memberName => memberName.MemberOws))
    ];
    if (memberInfo.length > 0) {
      memberInfo.map(memberName => {
        let finalMoney = 0;
        const allTransaction = this.state.show.filter(
          x => x.MemberOws == memberName
        );
        allTransaction.map(x => {
          finalMoney += x.Amount;
        });
        const findName = this.state.show.find(x => x.MemberOws == memberName);
        memberWithOwsGetsDetail.push({
          Amount: finalMoney,
          Transaction: allTransaction,
          GroupName: findName.GroupName,
          MemberOwsName: findName.MemberOwsName,
          MemberProfilePic: findName.MemberProfilePicOws,
          MemberOws: findName.MemberOws,
          GroupID: findName.GroupID._id
        });
      });
      this.setState({
        memberWithAmountList: memberWithOwsGetsDetail
      });
    }
  }

  validateForm = () => {
    let error = "";
    if (this.state.Name === "") error = "Please fill mandatory field";
    return error;
  };

  handleSettleUp = e => {
    //prevent page from refresh
    e.preventDefault();
    const data = {
      Amount: this.state.Amount,
      MemberID: this.state.ID,
      GroupID: this.state.GroupID,
      RealID: this.state.RealName,
      MemberOws: this.state.MemberOws
    };
    const error = this.validateForm();
    if (Object.keys(error).length == 0) {
      this.props.settleUp(data);
      this.closeModal();
    }
  };

  componentDidMount() {
    let localStorageData = {};
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        localStorageData = JSON.parse(localStorage.getItem("userData"));
        this.setState({
          Currency: localStorageData.Currency,
          ID: localStorageData._id
        });
      }
    }
    this.props.getUserSpecificTransactionDetail(localStorageData._id);
  }

  componentDidUpdate(prevState) {
    if (prevState.userAmountDetails != this.props.userAmountDetails) {
      this.calculateOwsGetsBasedOnDataReceived();
    }
  }

  render() {
    let componentOws = null;
    let componentGets = null;
    let memberOwList = [];
    let sumOws = 0,
      sumGets = 0,
      total = 0;
    this.state.memberWithAmountList.map(detail => {
      // console.log(JSON.stringify(detail));
      if (detail.Amount < 0) {
        sumOws += detail.Amount;
      } else {
        sumGets += detail.Amount;
      }
    });
    total = sumGets + sumOws;
    componentOws = this.state.memberWithAmountList.map((detail, idx) => {
      //console.log(JSON.stringify(this.state.memberWithAmountList));
      if (detail.Amount < 0) {
        memberOwList.push(detail);
        return (
          <div key={idx} className="row orangeCode">
            <div className="col col-sm-2">
              <img
                className="rounded-circle"
                src={
                  detail.MemberProfilePic == ""
                    ? "./assets/userIcon.png"
                    : detail.MemberProfilePic
                }
                width={30}
                height={30}
              ></img>
            </div>
            <div className="col">
              <p style={{ fontSize: "15px" }}>
                <strong>{detail.MemberOwsName} </strong>
                <br />
                you ows {this.state.Currency}
                {detail.Amount.toFixed(2)} <br />
                {detail.Transaction.map((value, idy) => {
                  if (value.Amount < 0) {
                    return (
                      <p className="dashBoardLabel" key={idy}>
                        o: you owe{" "}
                        <strong className="orangeCode">
                          {this.state.Currency}
                          {-value.Amount.toFixed(2)}
                        </strong>{" "}
                        for {value.GroupName}
                      </p>
                    );
                  } else if (value.Amount > 0) {
                    return (
                      <p key={idy} className="dashBoardLabel">
                        o: owes you{" "}
                        <strong className="greenCode">
                          {" "}
                          {this.state.Currency}
                          {value.Amount.toFixed(2)}
                        </strong>{" "}
                        for {value.GroupName}
                      </p>
                    );
                  }
                })}
              </p>
            </div>
          </div>
        );
      }
    });
    componentGets = this.state.memberWithAmountList.map((detail, idx) => {
      if (detail.Amount > 0) {
        return (
          <div key={idx} className="row greenCode">
            <div className="col col-sm-2">
              {" "}
              <img
                className="rounded-circle"
                src={
                  detail.MemberProfilePic == ""
                    ? "./assets/userIcon.png"
                    : detail.MemberProfilePic
                }
                width={30}
                height={30}
              ></img>
            </div>
            <div className="col">
              <p style={{ fontSize: "15px" }}>
                <strong>{detail.MemberOwsName}</strong>
                <br /> owes you {this.state.Currency}
                {detail.Amount.toFixed(2)} <br />
                {detail.Transaction.map((value, idy) => {
                  if (value.Amount < 0) {
                    return (
                      <p className="dashBoardLabel" key={idy}>
                        o: you owe{" "}
                        <strong className="orangeCode">
                          {this.state.Currency}
                          {-value.Amount.toFixed(2)}
                        </strong>{" "}
                        for {value.GroupName}
                      </p>
                    );
                  } else if (value.Amount > 0) {
                    return (
                      <p key={idy} className="dashBoardLabel">
                        o: owes you{" "}
                        <strong className="greenCode">
                          {" "}
                          {this.state.Currency}
                          {value.Amount.toFixed(2)}
                        </strong>{" "}
                        for {value.GroupName}
                      </p>
                    );
                  }
                })}
              </p>
            </div>
          </div>
        );
      }
    });
    const popover = memberOwList.map((detail, idx) => {
      return (
        <Dropdown.Item key={idx} onClick={() => this.alertClicked(detail)}>
          {detail.MemberOwsName}
        </Dropdown.Item>
      );
    });
    return (
      <div className="container">
        <div className="row shadow bg-light rounded">
          <div className="col col-sm-8 border-bottom ">
            <label className="md-1">
              <h3 style={{ marginTop: "10px", marginLeft: "20px" }}>
                <strong>DashBoard</strong>
              </h3>
            </label>
          </div>
          <div
            className="col col-sm-4 border-bottom"
            style={{ textAlign: "right" }}
          >
            <Button
              className="btn btn-Normal"
              type="button"
              style={{
                lineHeight: "40px",
                width: "120px",
                textAlign: "center"
              }}
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
            className="col col-sm-4 border-right"
            style={{ textAlign: "center", marginTop: "10px" }}
          >
            <p style={{ marginRight: "3px" }}>
              total balance: <br />
              <strong
                style={total < 0 ? { color: "#f07343" } : { color: "#5bc5a7" }}
              >
                {this.state.Currency}
                {total.toFixed(2)}
              </strong>
            </p>
          </div>
          <div
            className="col col-sm-4 border-right"
            style={{ textAlign: "center", marginTop: "10px" }}
          >
            <p>
              you owe: <br />
              <strong className="orangeCode" style={{ marginLeft: "3px" }}>
                {this.state.Currency}
                {sumOws.toFixed(2)}
              </strong>
            </p>
          </div>
          <div
            className="col col-sm-4"
            style={{ textAlign: "center", marginTop: "10px" }}
          >
            <p>
              you are owed: <br />
              <strong className="greenCode" style={{ marginLeft: "3px" }}>
                {this.state.Currency}
                {sumGets.toFixed(2)}
              </strong>
            </p>
          </div>
        </div>
        <div className="row top-buffer shadow p-5 mb-8 bg-white rounded">
          <div className="col col-sm-6 border-right">
            <label style={{ color: "GrayText", marginLeft: "10px" }}>
              <strong>You owes</strong>
            </label>
            {componentOws}
          </div>
          <div className="col col-sm-6">
            <label style={{ color: "GrayText", marginLeft: "10px" }}>
              <strong>You are owed</strong>
            </label>
            {componentGets}
          </div>
        </div>
        <Modal show={this.state.isOpen} onHide={this.closeModal}>
          <Modal.Header className="custom-header" closeButton>
            <Modal.Title style={{ marginLeft: "10px" }}>Settle Up</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <div
                id="errorLogin"
                hidden={this.state.error === "" ? true : false}
                className="alert alert-danger"
                role="alert"
              >
                {this.state.error}
              </div>
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
                        borderRadius: 1
                      }}
                      type="text"
                      value={this.state.RealName}
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
                        textDecoration: "none"
                      }}
                      type="number"
                      step="0.1"
                      value={
                        this.state.Amount == 0
                          ? ""
                          : -this.state.Amount.toFixed(2)
                      }
                      placeholder={this.state.Currency + "0.00"}
                      readOnly
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

const mapStateToProps = state => {
  return {
    userAmountDetails: state.homeReducer.userAmountDetails
  };
};

export default connect(mapStateToProps, {
  getUserSpecificTransactionDetail,
  settleUp
})(Dashboard);
