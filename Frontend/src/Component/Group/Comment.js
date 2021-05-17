import React, { Component } from "react";
import { Card, Accordion } from "react-bootstrap";
import ModelWindow from "./ModelComponent";
//import { useAccordionToggle } from "react-bootstrap/AccordionToggle";

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Currency: "",
      transactionID: "",
      UserId: "",
      component: null,
      isOpen: false,
      currentactiveKey: ""
    };
  }

  openModal = (e, expenseDetail) => {
    e.preventDefault();
    this.setState({
      isOpen: true,
      component: (
        <ModelWindow
          isOpen={true}
          transactionDetail={expenseDetail}
        ></ModelWindow>
      )
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
  }

  render() {
    return (
      <span className="block-example border-bottom border-dark">
        <Card key={this.props.transDetail._id}>
          <Accordion.Toggle
            key={this.props.transDetail._id}
            as={Card.Header}
            eventKey={this.props.transDetail._id}
          >
            <div className="row" style={{ margin: "0px" }}>
              <div className="col-sm-8">
                {new Date(this.props.transDetail.Time).toLocaleDateString(
                  "default",
                  {
                    month: "short",
                    day: "numeric"
                  }
                )}
                &emsp;
                <img src="./assets/expense.png" height={30} width={20}></img>
                <label style={{ paddingLeft: "10px" }}>
                  {this.props.transDetail.TransactionDetail}
                </label>
              </div>
              <div className="col-sm-4">
                <p
                  style={{
                    color: "GrayText",
                    textAlign: "right",
                    fontSize: 13
                  }}
                >
                  {this.props.transDetail.MemberID.Name}
                  <br />
                  paid <br />
                  {this.state.Currency}
                  {this.props.transDetail.Amount}
                </p>
              </div>
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={this.props.transDetail._id}>
            <Card.Body style={{ paddingTop: "0px", margin: "0px" }}>
              <div className="row border-top shadow bg-light">
                <div className="col col-sm-6 border-right">
                  {this.state.component}
                </div>
              </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </span>
      // </Accordion>
    );
  }
}

export default Comment;
