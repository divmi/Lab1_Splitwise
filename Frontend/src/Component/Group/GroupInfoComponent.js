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
class GroupInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      transaction_description: "",
      amount: 0,
    };
  }

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });

  handleTransactionChange = (e) => {
    console.log("Control reached :" + e.target.value);
    this.setState({
      transaction_description: e.target.value,
    });
  };

  handleAmountChange = (e) => {
    this.setState({
      amount: e.target.value,
    });
  };

  handleSubmit = () => {
    console.log("Submit button " + this.state.transaction_description);
    this.closeModal();
  };

  render() {
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
        </div>
      </div>
    );
  }
}

export default GroupInfo;
