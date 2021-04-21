import React, { Component } from "react";
import {
  Modal,
  Button,
  Row,
  Col,
  Image,
  Container,
  Form
} from "react-bootstrap";
import OwsGetDetail from "./OwsGetsInfo";
import { Link } from "react-router-dom";
import {
  getTransactionDetail,
  addTransactionToDatabase
} from "../../actions/groupInfo";
import { resetSuccessFlag } from "../../actions/loginAction";
import { connect } from "react-redux";
import Comment from "./Comment";

class GroupInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      transaction_description: "",
      amount: 0,
      serverError: "",
      error: "",
      component: null,
      Currency: "",
      UserId: "",
      axiosCallInProgress: false
    };
  }

  openModal = (e, expenseDetail) => {
    console.log(JSON.stringify(expenseDetail));
    if (e.target.name == "btn-Edit-Expense") {
      this.setState({
        transaction_description: expenseDetail.TransactionDetail,
        amount: expenseDetail.Amount
      });
    } else {
      this.setState({
        transaction_description: "",
        amount: ""
      });
    }
    console.log(this.state.transaction_description);
    this.setState({ isOpen: true, error: "" });
  };
  closeModal = () => {
    this.setState({ isOpen: false });
    this.props.getTransactionDetail(this.props.name);
    this.OpenOwsGetsAmount(true);
  };

  handleTransactionChange = e => {
    this.setState({
      transaction_description: e.target.value
    });
  };

  componentDidMount() {
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        const localStorageData = JSON.parse(localStorage.getItem("userData"));
        this.setState({
          Currency: localStorageData.Currency,
          UserId: localStorageData._id
        });
      }
    }
    this.setState({
      axiosCallInProgress: true
    });
    this.props.getTransactionDetail(this.props.name);
    this.OpenOwsGetsAmount(false);
  }

  componentDidUpdate(prevState) {
    if (prevState.name !== this.props.name) {
      console.log(this.props.name);
      this.props.getTransactionDetail(this.props.name);
      this.OpenOwsGetsAmount(false);
      this.setState({
        axiosCallInProgress: false
      });
    }
    if (prevState.authFlag != this.props.authFlag && this.props.authFlag) {
      console.log("close Modal got called from update function");
      this.closeModal();
      this.props.resetSuccessFlag();
    }
  }

  OpenOwsGetsAmount(transactionUpdated) {
    this.setState({
      component: (
        <OwsGetDetail
          name={this.props.name}
          groupMemberName={this.props.groupMember}
          updated={transactionUpdated}
        />
      )
    });
  }

  handleAmountChange = e => {
    if (e.target.value > 99999999) {
      return;
    }
    this.setState({ amount: e.target.value });
  };

  validateForm = () => {
    let error = "";
    if (this.state.transaction_description === "")
      error = "Please fill transaction Detail";
    else if (this.state.amount === "") error = "Please fill the amount";
    else if (this.state.amount === 0) error = "Amount should be greater than 0";
    return error;
  };

  handleSubmit = e => {
    e.preventDefault();
    const data = {
      transactionDetail: this.state.transaction_description,
      amount: this.state.amount,
      groupID: this.props.name,
      groupMember: this.props.groupMember,
      memberID: this.state.UserId
    };

    const error = this.validateForm();
    if (Object.keys(error).length == 0) {
      this.props.addTransactionToDatabase(data);
    } else {
      this.setState({
        error: error,
        authFlag: false,
        transaction_description: "",
        amount: 0
      });
    }
  };

  render() {
    let showTransaction = null;
    let index = 0;
    if (this.props.transactionDetail.length > 0) {
      showTransaction = this.props.transactionDetail.map(name => {
        if (name.Amount > 0) {
          index = index + 1;
          return (
            <Comment key={index} transDetail={name} index={index}></Comment>
          );
        }
      });
    } else {
      showTransaction = (
        <div>
          <img
            src="./assets/NoExpenseFound.png"
            height={350}
            width={350}
            className="img"
          ></img>
          <h3>
            You have not added any expenses yet <i className="fas fa-frown"></i>
          </h3>
          <h5>Click on Add Expense button to start</h5>
        </div>
      );
    }

    return (
      <div className="container-flex">
        <div
          className="row border-bottom rounded bg-light"
          style={{ paddingTop: "20px" }}
        >
          <div className="col col-sm-4">
            <div
              className="row"
              style={{
                marginLeft: 10,
                marginTop: 5,
                fontWeight: "bold",
                fontSize: "25px"
              }}
            >
              <img
                src={this.props.groupPhoto}
                className="rounded-circle profileImage"
              ></img>
              <label style={{ paddingLeft: "10px" }}>
                {this.props.groupName}
              </label>
            </div>
          </div>
          <hr></hr>
          <div
            className="col col-sm-5"
            style={{ textAlign: "right", marginTop: -5 }}
          >
            <Button
              variant="primary"
              className="btn btn-signup shadow-none"
              style={{
                textAlign: "center",
                fontSize: 12,
                width: 110
              }}
              onClick={this.openModal}
            >
              Add an Expense
            </Button>
            <Link to={`/editGroup/${this.props.name}`}>
              <Button className="btn btn-light shadow-none">
                <i className="fas fa-cog "></i>
              </Button>
            </Link>
          </div>
          <Modal show={this.state.isOpen} onHide={this.closeModal}>
            <Modal.Header className="custom-header" closeButton>
              <Modal.Title style={{ marginLeft: "10px" }}>
                Add an Expense
              </Modal.Title>
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
                  <label>With you and : {this.props.groupName}</label>
                </Row>
                <hr></hr>
                <Row>
                  <Col xs={6} md={4}>
                    <Image
                      width={130}
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
                          textDecoration: "none"
                        }}
                        type="text"
                        value={this.state.transaction_description}
                        onChange={this.handleTransactionChange}
                        placeholder="Enter a description"
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
                        name="amount"
                        id="amount"
                        onKeyDown={evt =>
                          (evt.key === "e" || evt.key === "-") &&
                          evt.preventDefault()
                        }
                        type="number"
                        step="0.1"
                        min="0"
                        value={this.state.amount}
                        onChange={this.handleAmountChange}
                        placeholder={this.state.Currency + "0.00"}
                        required
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>
                        Paid by <strong>you</strong> and split{" "}
                        <strong>equally</strong>
                      </Form.Label>
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
                type="submit"
                onClick={this.handleSubmit}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <div className="row shadow p-2 bg-light rounded border-right">
          <div className="col col-sm-9">{showTransaction}</div>
          <div
            className="col col-sm-3 border-left"
            style={{ paddingLeft: "20px" }}
          >
            <p style={{ fontWeight: "bold" }}>Group Summary</p>
            {this.state.component}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    transactionDetail: state.groupInfo.transactionDetail,
    authFlag: state.groupInfo.authFlag
  };
};

export default connect(mapStateToProps, {
  getTransactionDetail,
  addTransactionToDatabase,
  resetSuccessFlag
})(GroupInfo);
