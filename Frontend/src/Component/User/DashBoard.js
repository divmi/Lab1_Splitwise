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
      ows: 0,
      gets: 0,
      total: 0,
      show: [],
      Name: "",
      Amount: 0,
      anchorEl: null,
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
      Name: detail.MemberOws,
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
      console.log(JSON.stringify(this.state.show));
      this.state.show.map((detail) => {
        if (detail.Amount > 0) {
          sumGets += detail.Amount;
        } else {
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
  }

  render() {
    let component = null;
    let memberOwList = [];
    component = this.state.show.map((detail, idx) => {
      if (detail.Amount < 0) {
        memberOwList.push(detail);
        return (
          <tr key={idx}>
            <td style={{ color: "#f07343" }}>
              <label>
                you ows <strong>{-detail.Amount.toFixed(2)}</strong> to{" "}
                {detail.MemberOws} in {detail.GroupName}
              </label>
            </td>
          </tr>
        );
      } else if (detail.Amount > 0) {
        return (
          <tr key={idx}>
            <td style={{ color: "#5bc5a7" }}>
              <label>
                you gets <strong>{detail.Amount.toFixed(2)}</strong> from{" "}
                {detail.MemberOws} from {detail.GroupName}
              </label>
            </td>
          </tr>
        );
      }
    });
    const popover = memberOwList.map((detail, idx) => {
      return (
        <Dropdown.Item
          key={idx}
          action
          onClick={() => this.alertClicked(detail)}
        >
          {detail.MemberOws}
        </Dropdown.Item>
      );
    });
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
              onClick={this.openModal}
            >
              Settle Up
            </Button>
            <Modal show={this.state.isOpen} onHide={this.closeModal}>
              <Modal.Header className="custom-header" closeButton>
                <Modal.Title style={{ marginLeft: "10px" }}>
                  Settle Up
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Container>
                  <Row>
                    <label style={{ alignSelf: "center", marginRight: 20 }}>
                      With you and{" "}
                    </label>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="secondary"
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
                            textDecoration: "none",
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
                            textDecoration: "none",
                          }}
                          type="number"
                          step="0.1"
                          min="0"
                          value={-this.state.Amount}
                          readOnly
                          placeholder="0.00"
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

        <div className="row top-buffer shadow p-5 mb-8 bg-white rounded">
          <table>
            <thead>
              <tr>
                <td>
                  <label>Details:</label>
                </td>
              </tr>
            </thead>
            <tbody>{component}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Dashboard;
