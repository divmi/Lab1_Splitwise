import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

class GroupInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });

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
          </div>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "100vh" }}
          >
            <Button variant="primary" onClick={this.openModal}>
              Launch demo modal
            </Button>
            <Modal show={this.state.isOpen} onHide={this.closeModal}>
              <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
              </Modal.Header>
              <Modal.Body>Woohoo Finaly the form is ready to go</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.closeModal}>
                  Close
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
