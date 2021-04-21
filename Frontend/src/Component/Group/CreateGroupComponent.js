import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import NewUser from "./NewUser";
import axios from "axios";
import config from "../../config";
import { connect } from "react-redux";
import { sendCreateGroupRequest } from "../../actions/createGroup";
import { resetSuccessFlag } from "../../actions/loginAction";

class CreateGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: "",
      error: "",
      groupPhoto: "",
      userData: [],
      Name: "",
      Email: "",
      ID: "",
      UserProfilePic: "",
      success: "",
      newGroupMembers: []
    };
  }
  OnNameChange = e => {
    if (e.target.textContent != "") {
      let newGroupMembersBackup = [...this.state.newGroupMembers];
      let found = this.props.allUser.find(
        element => element.Name == e.target.textContent
      );
      if (found) {
        let item = {
          ...newGroupMembersBackup[newGroupMembersBackup.length],
          ID: found._id,
          Name: found.Name,
          Email: found.Email,
          Accepted: 0
        };
        newGroupMembersBackup[newGroupMembersBackup.length] = item;
        let items = this.state.userData;
        items.splice(0, 1);
        this.setState({
          newGroupMembers: newGroupMembersBackup,
          userData: items
        });
        console.log(JSON.stringify(this.state.newGroupMembers));
      }
    }
  };

  onEmailChange = e => {
    if (e.target.textContent != "") {
      let newGroupMembersBackup = [...this.state.newGroupMembers];
      let found = this.props.allUser.find(
        element => element.Email == e.target.textContent
      );
      if (found) {
        let item = {
          ...newGroupMembersBackup[newGroupMembersBackup.length],
          ID: found._id,
          Name: found.Name,
          Email: found.Email,
          Accepted: 0
        };
        newGroupMembersBackup[newGroupMembersBackup.length] = item;
        this.setState({
          newGroupMembers: newGroupMembersBackup
        });
      }
      console.log(JSON.stringify(this.state.newGroupMembers));
    }
  };

  addNewRow = () => {
    this.setState(prevState => ({
      i: prevState.i + 1,
      userData: [
        ...prevState.userData,
        { ID: "", Name: "", Email: "", Accepted: 0 }
      ]
    }));
  };

  handleSubmit = e => {
    e.preventDefault();
    let error = this.validateForm();
    if (Object.keys(error).length == 0) {
      this.props.sendCreateGroupRequest(this.state);
    } else {
      this.setState({
        error: error,
        success: false
      });
    }
  };

  groupNameEventHandler = e => {
    this.setState({
      groupName: e.target.value
    });
  };

  handleItemDeleted(e, i, newMemberdelete) {
    e.preventDefault();
    let items = [];
    if (newMemberdelete) items = this.state.newGroupMembers;
    else items = this.state.userData;
    items.splice(items.indexOf(i), 1);
    if (newMemberdelete)
      this.setState({
        newGroupMembers: items,
        error: ""
      });
    else
      this.setState({
        userData: items,
        error: ""
      });
  }

  componentDidMount() {
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        var data = JSON.parse(localStorage.getItem("userData"));
        var user = {
          ID: data._id,
          Name: data.Name,
          Email: data.Email,
          Accepted: 1
        };
        this.setState({
          newGroupMembers: [user]
        });
      }
    }
  }

  componentDidUpdate(prevState) {
    if (prevState.authFlag != this.props.authFlag) {
      this.props.resetSuccessFlag();
      this.setState({
        success: true
      });
    }
    if (prevState.createGroupError != this.props.createGroupError) {
      this.setState({
        error: this.props.createGroupError
      });
    }
  }

  hasDuplicates(array) {
    const uniqueValues = new Set(array.map(v => v.Email));
    if (uniqueValues.size < array.length) {
      return true;
    }
  }

  validateForm = () => {
    let error = "";
    if (this.state.groupName === "") error = "Group Name should not be blank";
    else if (this.state.userData.length == 0)
      error = "Group length should be greater than one";
    else if (this.state.userData.length >= 9)
      error = "Group length should be less than ten";
    else if (this.hasDuplicates(this.state.userData))
      error = "Duplicate Member exist. Please add unique members";
    return error;
  };

  handleFileUpload = event => {
    event.preventDefault();
    let data = new FormData();
    console.log(event.target.files[0]);
    data.append("file", event.target.files[0]);
    axios
      .post(`http://${config.ipAddress}:8000/upload`, data)
      .then(response => {
        console.log(response);
        this.setState({
          groupPhoto: `http://${config.ipAddress}:8000/` + response.data
        });
      })
      .catch(error => console.log("error " + error));
  };

  render() {
    let redirectVar = null;
    let message = null;
    let picture = null;
    if (this.state.groupPhoto == "") {
      picture = "./assets/userIcon.jpg";
    } else {
      picture = this.state.groupPhoto;
    }
    if (this.state.success) {
      message = <Redirect to="/home" />;
    }
    let newuser = this.state.newGroupMembers.map((val, idx) => {
      return (
        <tr key={idx}>
          <td>
            <input
              type="text"
              name="Name"
              value={val.Name}
              data-id="0"
              id="Name"
              className="form-control "
              onChange={() => {}}
            />
          </td>
          <td>
            <input
              type="text"
              data-testid="id-input-box"
              name="email"
              id="email"
              data-id="0"
              value={val.Email}
              className="form-control "
              onChange={() => {}}
            />
          </td>
          <td>
            <button
              className="btn"
              onClick={e => this.handleItemDeleted(e, val, true)}
            >
              <i className="fa fa-remove" aria-hidden="true"></i>
            </button>
          </td>
        </tr>
      );
    });
    let x = this.state.userData.map((val, idx) => {
      return (
        <NewUser
          key={idx}
          val={val}
          delete={this.handleItemDeleted.bind(this)}
          userData={this.state.userData}
          tableData={this.props.allUser}
          change={this.OnNameChange.bind(this)}
          emailChange={this.onEmailChange.bind(this)}
        />
      );
    });
    const data = JSON.parse(localStorage.getItem("userData"));
    if (data == null) {
      redirectVar = <Redirect to="/login" />;
    }
    return (
      <div className="container-flex">
        {message}
        {redirectVar}
        <div className="row rounded" style={{ alignContent: "center" }}>
          <div className="col-sm-2 offset-2" style={{ marginTop: "100px" }}>
            <img src={picture} alt="..." width={200} height={200}></img>
            <label>Select your profile picture:</label>
            <input
              className="btn"
              style={{
                marginLeft: "-20px",
                width: 230,
                textAlign: "left"
              }}
              type="file"
              name="image"
              onChange={this.handleFileUpload}
            />
          </div>
          <div className="col-sm-8">
            <div className="content">
              <p
                className="help-block alert"
                style={{ color: "red", marginLeft: "60px" }}
              >
                {this.state.error}
              </p>
              <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                <div className="row">
                  <div className="col-sm-1"></div>
                  <div className="col-sm-8">
                    <div className="card">
                      <div className="card-header">
                        <h3 style={{ textAlign: "center" }}>
                          Start a Group Name
                        </h3>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-sm-12">
                            <div className="form-group ">
                              <label className="required">
                                My Group shall be called:
                              </label>
                              <input
                                name="groupName"
                                data-testid="groupName-input-box"
                                id="groupName"
                                className="form-control"
                                onChange={this.groupNameEventHandler}
                              ></input>
                            </div>
                          </div>
                        </div>
                        <div className="card-header text-center">
                          Add Your Group Member
                        </div>
                        <table className="table">
                          <tbody>
                            {newuser}
                            {x}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td>
                                <button
                                  onClick={this.addNewRow}
                                  type="button"
                                  className="btn text-center"
                                >
                                  <i
                                    className="fa fa-plus-circle"
                                    aria-hidden="true"
                                  ></i>
                                  Add a person
                                </button>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      <div className="card-footer text-center">
                        <button
                          type="submit"
                          className="btn btn-Normal text-center"
                          onClick={this.handleSubmit}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    allUser: state.createGroup.allUser,
    authFlag: state.createGroup.authFlag,
    createGroupError: state.createGroup.createGroupError
  };
};

export default connect(mapStateToProps, {
  sendCreateGroupRequest,
  resetSuccessFlag
})(CreateGroup);
