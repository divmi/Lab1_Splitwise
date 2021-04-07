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

class ModelWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      error: "",
      transaction_description: "",
      amount: 0,
      Currency: "",
    };
  }
  componentDidMount() {
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        const localStorageData = JSON.parse(localStorage.getItem("userData"));
        this.setState({
          Currency: localStorageData.Currency,
          //UserId: localStorageData._id,
        });
      }
    }
    this.setState({
      transaction_description: this.props.transactionDetail.TransactionDetail,
      amount: this.props.transactionDetail.Amount,
      isOpen: this.props.isOpen,
    });
  }

  closeModal = () => {
    this.setState({ isOpen: false });
  };

  componentDidUpdate(prevState) {
    if (prevState.isOpen != this.props.isOpen) {
      console.log("isopen is getting set");
      this.setState({
        isOpen: this.props.isOpen,
      });
    }
  }

  handleTransactionChange = (e) => {
    this.setState({
      transaction_description: e.target.value,
    });
  };

  handleAmountChange = (e) => {
    this.setState({
      amount: e.target.value,
    });
  };

  render() {
    return (
      <div>
        <Modal show={this.state.isOpen} onHide={this.closeModal}>
          <Modal.Header className="custom-header" closeButton>
            <Modal.Title style={{ marginLeft: "10px" }}>
              Edit Expense
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
                <label>
                  With you and :{" "}
                  {this.props.transactionDetail.GroupID.GroupName}
                </label>
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
    );
  }
}
export default ModelWindow;
