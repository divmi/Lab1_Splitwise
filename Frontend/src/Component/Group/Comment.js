import React, { Component } from "react";
import { connect } from "react-redux";
import {
  addCommentsToDatabase,
  getCommentFromDatabase,
  deleteCommentFromDatabase
} from "../../actions/comments";
import { Card, Accordion } from "react-bootstrap";
import ModelWindow from "./ModelComponent";

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textComments: "",
      Currency: "",
      transactionID: "",
      UserId: "",
      component: null,
      isOpen: false
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

  addComment = e => {
    e.preventDefault();
    //let comments = this.state.comments;
    let newComment = {
      comment: this.state.textComments,
      transactionID: this.props.transDetail._id,
      memberCommented: this.state.UserId
    };
    //comments.push(newComment);
    this.props.addCommentsToDatabase(newComment);
    this.setState({
      textComments: ""
    });
  };

  handleCommentChange = e => {
    this.setState({
      textComments: e.target.value
    });
  };

  componentDidMount() {
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        const localStorageData = JSON.parse(localStorage.getItem("userData"));
        console.log("Component got mounted comments");
        this.setState({
          Currency: localStorageData.Currency,
          UserId: localStorageData._id
        });
      }
    }
  }

  deleteComment = (e, id) => {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this comment?")) {
      const data = {
        transactionID: this.state.transactionID,
        commentID: id._id
      };
      this.props.deleteCommentFromDatabase(data);
    } else {
      console.log("Thing was not saved to the database.");
    }
  };

  getCommentFromDatabase = (e, id) => {
    e.preventDefault();
    this.props.getCommentFromDatabase(id);
    this.setState({
      transactionID: this.props.transDetail._id
    });
  };

  render() {
    let showComments = null;
    if (this.props.comments.length > 0) {
      showComments = this.props.comments.map((value, idx) => {
        return (
          <div key={idx} className="input-group" style={{ margin: "5px" }}>
            <p style={{ fontSize: "13px" }}>
              <strong>{value.MemberCommented.Name}</strong>
              <button
                type="button border-none"
                className="btn bg-transparent"
                onClick={e => this.deleteComment(e, value)}
              >
                <i
                  className="fa fa-remove"
                  style={{ color: "#6d1111", fontWeight: "normal" }}
                  aria-hidden="true"
                ></i>
              </button>
              <br />
              {value.Comment}
            </p>
          </div>
        );
      });
    }
    return (
      <span className="block-example border-bottom border-dark">
        <Card key={this.props.index}>
          <Accordion.Toggle
            as={Card.Header}
            eventKey={this.props.index}
            onClick={e =>
              this.getCommentFromDatabase(e, this.props.transDetail._id)
            }
          >
            <div className="row" style={{ padding: 0 }}>
              <div className="col-sm-8">
                {new Date(this.props.transDetail.Time).toLocaleDateString(
                  "default",
                  {
                    month: "short",
                    day: "numeric"
                  }
                )}{" "}
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
          <Accordion.Collapse eventKey={this.props.index}>
            <Card.Body>
              <div className="row border-top shadow bg-light">
                <div className="col col-sm-6 border-right">
                  <div className="row transaction-padding">
                    <img
                      src="./assets/expense.png"
                      height={60}
                      width={50}
                    ></img>
                    <p style={{ color: "GrayText", fontSize: 13, padding: 10 }}>
                      {this.props.transDetail.TransactionDetail} <br />
                      {this.state.Currency}
                      {this.props.transDetail.Amount} <br />
                      paid by {this.props.transDetail.MemberID.Name}
                      <br />
                      {new Date(this.props.transDetail.Time).toLocaleString(
                        "en-us",
                        {
                          weekday: "long"
                        }
                      )}
                      <br />
                      <button
                        name="btn-Edit-Expense"
                        className="btn btn-edit"
                        onClick={e => this.openModal(e, this.props.transDetail)}
                      >
                        Edit expense
                      </button>
                    </p>
                  </div>
                </div>
                <div className="col col-sm-6">
                  <label
                    style={{
                      color: "GrayText",
                      fontSize: 12
                    }}
                  >
                    Notes and Comments
                  </label>
                  {showComments}
                  <textarea
                    name="Add comment"
                    style={{ marginBottom: "5px" }}
                    value={this.state.textComments}
                    className="form-control rounded"
                    onChange={this.handleCommentChange}
                  ></textarea>
                  <button
                    name="btn-AddComment"
                    className="btn btn-edit border-none"
                    onClick={this.addComment}
                  >
                    Post
                  </button>
                  {this.state.component}
                </div>
              </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </span>
    );
  }
}

const mapStateToProps = state => {
  return {
    comments: state.comments.commentsFromDB
  };
};

export default connect(mapStateToProps, {
  addCommentsToDatabase,
  getCommentFromDatabase,
  deleteCommentFromDatabase
})(Comment);
