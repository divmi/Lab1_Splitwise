import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router-dom";
import NewUser from "./NewUser";
import axios from "axios";
import config from "../../config";
class CreateGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: "",
      error: "",
      groupPhoto: "",
      auth: false,
      userData: [],
      allUser: [],
      Name: "",
      Email: "",
    };
  }
  OnNameChange = (e) => {
    //if (["userName"].includes(e.target.id)) {
    if (e.target.textContent != "") {
      let userDataBackup = [...this.state.userData];
      let found = this.state.allUser[0].find(
        (element) => element.Name == e.target.textContent
      );
      if (found) {
        let item = {
          ...userDataBackup[userDataBackup.length - 1],
          Name: found.Name,
          Email: found.Email,
          Accepted: 0,
        };
        userDataBackup[userDataBackup.length - 1] = item;
        this.setState({
          userData: userDataBackup,
        });
        console.log(JSON.stringify(this.state.userData));
      }
    }
  };

  onEmailChange = (e) => {
    if (e.target.textContent != "") {
      let userData = [...this.state.userData];
      let found = this.state.allUser[0].find(
        (element) => element.Email == e.target.textContent
      );
      if (found) {
        let item = {
          ...userData[userData.length - 1],
          Name: found.Name,
          Email: found.Email,
          Accepted: 0,
        };
        userData[userData.length - 1] = item;
        this.setState({
          userData,
        });
      }
      console.log(JSON.stringify(this.state.userData));
    }
  };

  addNewRow = () => {
    this.setState((prevState) => ({
      i: prevState.i + 1,
      userData: [...prevState.userData, { Name: "", Email: "", Accepted: 0 }],
    }));
  };

  handleSubmit = (e) => {
    //prevent page from refresh
    e.preventDefault();
    let error = this.validateForm();
    //set the with credentials to true
    if (Object.keys(error).length == 0) {
      axios.defaults.withCredentials = true;
      axios
        .post(`http://${config.ipAddress}:8000/createGroup`, this.state)
        .then((response) => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            this.setState({
              error: "",
              authFlag: true,
            });
          } else {
            this.setState({
              error: "Group is already registered",
              authFlag: false,
            });
          }
        })
        .catch(() => {
          this.setState({
            error: "Group is already registered",
            authFlag: false,
          });
        });
    } else {
      this.setState({
        error: error,
        authFlag: false,
      });
    }
  };

  groupNameEventHandler = (e) => {
    this.setState({
      groupName: e.target.value,
    });
  };

  async getAllUser() {
    await axios
      .get(`http://${config.ipAddress}:8000/getAllUser`)
      .then((response) => {
        if (response.status === 200) {
          console.log("All user:" + response.data);
          this.setState(() => ({
            allUser: [response.data],
          }));
        } else {
          this.setState({
            error: "User Not Found",
            authFlag: false,
          });
        }
      })
      .catch((e) => {
        this.setState({
          error: "User Not Found" + e,
        });
      });
  }

  handleItemDeleted(e, i) {
    e.preventDefault();
    var items = this.state.userData;
    items.splice(items.indexOf(i), 1);
    this.setState({
      userData: items,
    });
  }

  componentDidMount() {
    this.setState({ allUser: this.getAllUser() });
    if (cookie.load("cookie")) {
      var data = {
        Name: cookie.load("cookie").Name,
        Email: cookie.load("cookie").Email,
        Accepted: 1,
      };
      this.setState({
        userData: [data],
      });
    }
  }

  hasDuplicates(array) {
    const uniqueValues = new Set(array.map((v) => v.Email));
    if (uniqueValues.size < array.length) {
      return true;
    }
    return false;
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

  handleFileUpload = (event) => {
    event.preventDefault();
    let data = new FormData();
    console.log(event.target.files[0]);
    data.append("file", event.target.files[0]);
    axios
      .post(`http://${config.ipAddress}:8000/upload`, data)
      .then((response) => {
        console.log(response);
        this.setState({
          groupPhoto: `http://${config.ipAddress}:8000/` + response.data,
        });
      })
      .catch((error) => console.log("error " + error));
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
    if (this.state.authFlag) {
      message = <Redirect to="/home" />;
    }
    let x = this.state.userData.map((val, idx) => {
      return (
        <NewUser
          key={idx}
          val={val}
          delete={this.handleItemDeleted.bind(this)}
          userData={this.state.userData}
          tableData={this.state.allUser[0]}
          change={this.OnNameChange.bind(this)}
          emailChange={this.onEmailChange.bind(this)}
        />
      );
    });
    if (!cookie.load("cookie")) redirectVar = <Redirect to="/login" />;
    return (
      <div className="container-fluid">
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
                textAlign: "left",
              }}
              type="file"
              name="image"
              onChange={this.handleFileUpload}
            />
          </div>
          <div className="col-sm-8">
            <div className="content" style={{ width: "90%" }}>
              <p
                className="help-block alert"
                style={{ color: "red", marginLeft: "60px" }}
              >
                {this.state.error}
              </p>
              <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                <h3 style={{ textAlign: "left", marginLeft: "70px" }}>
                  Start a Group Name
                </h3>
                <div className="row">
                  <div className="col-sm-1"></div>
                  <div className="col-sm-8">
                    <div className="card">
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
                          <tbody>{x}</tbody>
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
                  <div className="col-sm-1"></div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateGroup;
