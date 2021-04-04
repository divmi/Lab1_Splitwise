import React, { Component } from "react";
import {
  Modal,
  Button,
  Row,
  Col,
  Image,
  Container,
  Form,
} from "react-bootstrap";
import OwsGetDetail from "./OwsGetsInfo";
import { Link } from "react-router-dom";
import {
  getTransactionDetail,
  addTransactionToDatabase,
  addCommentsToDatabase,
} from "../../actions/groupInfo";
import { resetSuccessFlag } from "../../actions/loginAction";
import { connect } from "react-redux";

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
      comments: [],
      textComments: "",
    };
  }

  openModal = (e, expenseDetail) => {
    console.log(JSON.stringify(expenseDetail));
    if (e.target.name == "btn-Edit-Expense") {
      this.setState({
        transaction_description: expenseDetail.TransactionDetail,
        amount: expenseDetail.Amount,
      });
    } else {
      this.setState({
        transaction_description: "",
        amount: "",
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

  handleCommentChange = (e) => {
    this.setState({
      textComments: e.target.value,
    });
  };

  handleTransactionChange = (e) => {
    this.setState({
      transaction_description: e.target.value,
    });
  };

  componentDidMount() {
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        const localStorageData = JSON.parse(localStorage.getItem("userData"));
        this.setState({
          Currency: localStorageData.Currency,
          UserId: localStorageData._id,
        });
      }
    }
    this.props.getTransactionDetail(this.props.name);
    this.OpenOwsGetsAmount(false);
  }

  componentDidUpdate(prevState) {
    if (prevState.name !== this.props.name) {
      console.log(this.props.name);
      this.props.getTransactionDetail(this.props.name);
      this.OpenOwsGetsAmount(false);
    }
    if (prevState.authFlag != this.props.authFlag && this.props.authFlag) {
      console.log("came here");
      this.closeModal();
      this.props.resetSuccessFlag();
      this.setState({
        axiosCallInProgress: false,
      });
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
      ),
    });
  }

  addComment = (e, transaction) => {
    e.preventDefault();
    //let comments = this.state.comments;
    let newComment = {
      comment: this.state.textComments,
      transactionID: transaction._id,
      memberCommented: this.state.UserId,
    };
    //comments.push(newComment);
    this.props.addCommentsToDatabase(newComment);
    this.setState({
      textComments: "",
    });
  };

  handleAmountChange = (e) => {
    this.setState({
      amount: e.target.value,
    });
  };

  validateForm = () => {
    let error = "";
    if (this.state.transaction_description === "")
      error = "Please fill transaction Detail";
    else if (this.state.amount === 0) error = "Please fill the amount";
    return error;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      transactionDetail: this.state.transaction_description,
      amount: this.state.amount,
      groupID: this.props.name,
      groupMember: this.props.groupMember,
      memberID: this.state.UserId,
    };

    const error = this.validateForm();
    if (Object.keys(error).length == 0) {
      this.props.addTransactionToDatabase(data);
    } else {
      this.setState({
        error: error,
        authFlag: false,
        transaction_description: "",
        amount: 0,
      });
    }
  };

  render() {
    let showTransaction = null;
    let showComments = null;
    let picture = "../assets/userIcon.png";
    //console.log(this.props.transactionDetail.length);

    if (this.state.comments.length > 0) {
      showComments = this.state.comments.map((value, idx) => {
        return (
          <div key={idx} className="input-group" style={{ padding: "2px" }}>
            <input
              type="text"
              className="form-control rounded"
              value={value.comment}
              readOnly
            />
            <button type="button" className="btn bg-transparent">
              <i
                className="fa fa-remove"
                style={{ color: "red", fontWeight: "normal" }}
                aria-hidden="true"
              ></i>
            </button>
          </div>
        );
      });
    }

    if (this.props.transactionDetail.length > 0) {
      showTransaction = this.props.transactionDetail.map((name, idx) => {
        if (name.Amount > 0) {
          return (
            <div key={idx} className="row border-bottom">
              <div className="col-sm-8 p-3">
                {new Date(name.Time).toLocaleDateString("default", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                &emsp;
                <img src="./assets/expense.png" height={30} width={20}></img>
                <a
                  style={{ color: "black", paddingLeft: "10px" }}
                  data-toggle="collapse"
                  href={"#" + idx}
                  aria-controls="collapseExample"
                >
                  {name.TransactionDetail}
                </a>
              </div>
              <div className="col-sm-4">
                <p
                  style={{
                    color: "GrayText",
                    textAlign: "right",
                    fontSize: 13,
                    padding: "10px",
                  }}
                >
                  {name.MemberID.Name}
                  <br />
                  paid <br />
                  {this.state.Currency}
                  {name.Amount}
                </p>
              </div>
              <div key={idx} className="collapse col col-sm-12" id={idx}>
                <div className="row border-top shadow bg-light">
                  <div className="col col-sm-6 border-right">
                    <div className="row transaction-padding">
                      <img
                        src="./assets/expense.png"
                        height={60}
                        width={50}
                      ></img>
                      <p
                        style={{ color: "GrayText", fontSize: 13, padding: 10 }}
                      >
                        {name.TransactionDetail} <br />
                        {this.state.Currency}
                        {name.Amount} <br />
                        paid by {name.MemberID.Name}
                        <br />
                        {new Date(name.Time).toLocaleString("en-us", {
                          weekday: "long",
                        })}
                        <br />
                        <button
                          name="btn-Edit-Expense"
                          className="btn btn-edit"
                          onClick={(e) => this.openModal(e, name)}
                        >
                          Edit expense
                        </button>
                      </p>
                    </div>
                  </div>
                  <div
                    className="col col-sm-4 transaction-padding"
                    style={{ textAlign: "left" }}
                  >
                    <label
                      style={{
                        color: "GrayText",
                        fontSize: 12,
                      }}
                    >
                      Notes and Comments
                    </label>
                    {showComments}
                    <textarea
                      name="Add comment"
                      value={this.state.textComments}
                      onChange={this.handleCommentChange}
                    ></textarea>
                    <button
                      name="btn-AddComment"
                      className="btn btn-edit"
                      onClick={(e) => this.addComment(e, name)}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      });
    } else {
      if (this.state.axiosCallInProgress) {
        showTransaction = <p className="spinner-border text-text-muted"></p>;
      } else
        showTransaction = (
          <div>
            <img
              src="./assets/NoExpense.png"
              height={350}
              width={350}
              className="img"
            ></img>
            <h3>
              You have not added any expenses yet{" "}
              <i className="fas fa-frown"></i>
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
                fontSize: "25px",
              }}
            >
              <img src={picture} className="rounded-circle profileImage"></img>
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
                width: 110,
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
                          textDecoration: "none",
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
                          textDecoration: "none",
                        }}
                        name="amount"
                        id="amount"
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
        <div className="row shadow p-3 mb-5 bg-light rounded border-right">
          <div className="col col-sm-9">{showTransaction}</div>
          <div
            className="col col-sm-3 border-left"
            style={{ paddingLeft: "30px" }}
          >
            <p style={{ fontWeight: "bold" }}>Group Summary</p>
            {this.state.component}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    transactionDetail: state.groupInfo.transactionDetail,
    authFlag: state.groupInfo.authFlag,
  };
};

export default connect(mapStateToProps, {
  getTransactionDetail,
  addTransactionToDatabase,
  resetSuccessFlag,
  addCommentsToDatabase,
})(GroupInfo);
