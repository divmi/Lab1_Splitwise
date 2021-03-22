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
import axios from "axios";
import cookie from "react-cookies";
import OwsGetAmount from "./OwsGetsInfo";
import { Link } from "react-router-dom";
import config from "../../config";

class GroupInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      transaction_description: "",
      transactionDetail: [],
      amount: 0,
      error: "",
      component: null,
      Currency: "",
      axiosCallInProgress: false,
    };
  }

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => {
    this.setState({ isOpen: false });
    this.getTransactionDetail();
    this.OpenOwsGetsAmount(false);
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
        });
      }
    }
    this.setState({ transactionDetail: this.getTransactionDetail() });
    this.OpenOwsGetsAmount(false);
  }

  getTransactionDetail() {
    this.setState({
      axiosCallInProgress: true,
    });
    axios
      .get(`http://${config.ipAddress}:8000/getTransactionInfo`, {
        params: {
          groupName: this.props.name,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState(() => ({
            transactionDetail: response.data,
            axiosCallInProgress: false,
          }));
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

  componentDidUpdate(prevState) {
    if (prevState.name !== this.props.name) {
      this.getTransactionDetail();
      this.OpenOwsGetsAmount(false);
    }
  }

  OpenOwsGetsAmount(transactionUpdated) {
    this.setState({
      component: (
        <OwsGetAmount name={this.props.name} updated={transactionUpdated} />
      ),
    });
  }

  handleAmountChange = (e) => {
    this.setState({
      amount: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      transactionDetail: this.state.transaction_description,
      amount: this.state.amount,
      groupname: this.props.name,
      memberID: cookie.load("cookie").Email,
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios
      .post(`http://${config.ipAddress}:8000/insertGroupTransaction`, data)
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            error: "",
            authFlag: true,
          });
          this.getTransactionDetail();
          this.OpenOwsGetsAmount(true);
        } else {
          this.setState({
            error: "Issue with Network",
            authFlag: false,
          });
        }
      })
      .catch(() => {
        this.setState({
          error: "Issue with Network",
        });
      });
    this.closeModal();
  };

  render() {
    let showTransaction = null;
    let picture = "../assets/userIcon.png";
    if (
      this.state.transactionDetail != null &&
      this.state.transactionDetail.length > 0
    ) {
      if (this.state.transactionDetail[0].GroupProfilePicture != "") {
        picture = this.state.transactionDetail[0].GroupProfilePicture;
      }
      showTransaction = this.state.transactionDetail.map((name, idx) => {
        return (
          <tr key={idx} style={{ verticalAlign: "center" }}>
            <td style={{ width: "8.33%", color: "GrayText" }}>
              {new Date(name.Time).toLocaleDateString("default", {
                month: "short",
                day: "numeric",
              })}
            </td>
            <td style={{ width: "60%" }}>
              <i
                className="fa fa-shopping-cart fa-2x"
                style={{ color: "green", marginRight: 3 }}
              ></i>
              {name.TransactionDetail}
            </td>
            <td
              style={{
                width: "30%",
                textAlign: "right",
                fontSize: 12,
                color: "GrayText",
              }}
            >
              {/* <p>
                 <br /> paid <br /> {this.state.Currency}
                {name.Amount}
              </p> */}
            </td>
          </tr>
        );
      });
    } else {
      if (this.state.axiosCallInProgress) {
        showTransaction = <p className="spinner-border text-text-muted"></p>;
      } else
        showTransaction = (
          <tr>
            <td>
              <img
                src="./assets/transaction.png"
                height={350}
                width={300}
                className="img"
              ></img>
              <h3>
                You have not added any expenses yet{" "}
                <i className="fas fa-frown"></i>
              </h3>
              <h5>Click on Add Expense button to start</h5>
            </td>
          </tr>
        );
    }

    return (
      <div className="container-flex p-3">
        <div className="row">
          <div className="col col-sm-4">
            <div className="row" style={{ marginLeft: 10, marginTop: 5 }}>
              <img src={picture} className="rounded-circle profileImage"></img>
              <h4>{this.props.name}</h4>
            </div>
          </div>
          <hr></hr>
          <div className="col col-sm-2"></div>
          <div
            className="col col-sm-5"
            style={{ textAlign: "left", marginLeft: -10, marginTop: -5 }}
          >
            <Button
              variant="primary"
              className="btn btn-signup shadow-none"
              style={{
                textAlign: "center",
                fontSize: 12,
                alignSelf: "center",
                width: 110,
                height: 40,
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
                <Row>
                  <label>With you and : {this.props.name}</label>
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
          <div className="col col-sm-8">
            <div className="row">
              <table className="table">
                <tbody>{showTransaction}</tbody>
              </table>
            </div>
          </div>
          <div className="col col-sm-4">
            <p style={{ fontWeight: "bold" }}>Group Summary</p>
            {this.state.component}
          </div>
        </div>
      </div>
    );
  }
}

export default GroupInfo;
