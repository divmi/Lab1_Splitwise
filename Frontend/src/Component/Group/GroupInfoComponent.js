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

class GroupInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      transaction_description: "",
      transactionDetail: [],
      amount: 0,
      error: "",
      uiUpdated: false,
    };
  }

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => {
    this.setState({ isOpen: false });
    this.getTransactionDetail();
  };

  handleTransactionChange = (e) => {
    console.log("Control reached :" + e.target.value);
    this.setState({
      transaction_description: e.target.value,
    });
  };

  componentDidMount() {
    this.setState({ transactionDetail: this.getTransactionDetail() });
    console.log(JSON.stringify(this.state.transactionDetail));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.transactionDetail !== this.state.transactionDetail) {
      console.log("pokemons state has changed.");
      this.setState({ transactionDetail: this.state.transactionDetail });
    }
  }

  getTransactionDetail() {
    axios
      .get("http://localhost:8000/getTransactionInfo", {
        params: {
          groupName: this.props.name,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("All user:" + response.data);
          this.setState(() => ({
            transactionDetail: [response.data],
          }));
          console.log("Group info" + this.state.transactionDetail);
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
      .post("http://localhost:8000/insertGroupTransaction", data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          this.setState({
            error: "",
            authFlag: true,
          });
        } else {
          this.setState({
            error: "Please enter correct credentials",
            authFlag: false,
          });
        }
      })
      .catch(() => {
        this.setState({
          error: "Please enter correct credentials",
        });
      });
    this.closeModal();
  };

  render() {
    let showTransaction = null;
    if (
      this.state.transactionDetail != null &&
      this.state.transactionDetail.length > 0
    ) {
      showTransaction = this.state.transactionDetail[0].map((name, idx) => {
        return (
          <tr key={idx}>
            <button
              key={idx}
              onClick={() => this.OpenGroupInfo(name.GroupName)}
            >
              {name.TransactionDetail}
            </button>
          </tr>
        );
      });
    }

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col col-sm-3">
            <h3>{this.props.name}</h3>
          </div>
          <div className="col col-sm-9">
            <button onClick={this.openModal}>Add an expense</button>
            <button>Settle Up</button>
            <Button variant="primary" onClick={this.openModal}>
              Launch demo modal
            </Button>
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
                          type="number"
                          onChange={this.handleAmountChange}
                          placeholder="0.00"
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
            <table className="table">
              <tbody>{showTransaction}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default GroupInfo;
